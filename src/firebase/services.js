import {
  collection, addDoc, updateDoc, doc,
  onSnapshot, query, where, orderBy,
  serverTimestamp, getDoc, setDoc
} from "firebase/firestore";
import { db } from "./config";

// ─── USERS ───────────────────────────────────────────

export const createUserProfile = async (uid, data) => {
  await setDoc(doc(db, "users", uid), {
    ...data,
    createdAt: serverTimestamp(),
    totalRides: 0,
    role: "rider", // "rider" | "driver" | "admin"
  });
};

export const getUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

// ─── RIDES ───────────────────────────────────────────

export const bookRide = async (rideData) => {
  return await addDoc(collection(db, "rides"), {
    ...rideData,
    status: "searching", // searching → accepted → ongoing → completed → cancelled
    createdAt: serverTimestamp(),
    driverId: null,
    driverName: null,
  });
};

export const cancelRide = async (rideId) => {
  await updateDoc(doc(db, "rides", rideId), { status: "cancelled" });
};

export const listenToRide = (rideId, callback) => {
  return onSnapshot(doc(db, "rides", rideId), (snap) => {
    callback({ id: snap.id, ...snap.data() });
  });
};

// ─── DRIVERS ─────────────────────────────────────────

export const getAvailableDrivers = (rideType, callback) => {
  const q = query(
    collection(db, "drivers"),
    where("online", "==", true),
    where("vehicleType", "==", rideType)
  );
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })));
  });
};

export const updateDriverStatus = async (driverId, online) => {
  await updateDoc(doc(db, "drivers", driverId), { online, updatedAt: serverTimestamp() });
};

export const acceptRide = async (rideId, driverData) => {
  await updateDoc(doc(db, "rides", rideId), {
    status: "accepted",
    driverId: driverData.id,
    driverName: driverData.name,
    driverPhone: driverData.phone,
    driverRating: driverData.rating,
    vehicleType: driverData.vehicleType,
    plateNumber: driverData.plateNumber,
  });
};

// ─── RATINGS ─────────────────────────────────────────

export const submitRating = async (rideId, rating, comment) => {
  await updateDoc(doc(db, "rides", rideId), {
    rating,
    ratingComment: comment,
    ratedAt: serverTimestamp(),
  });
};

// ─── SUPPORT ─────────────────────────────────────────

export const submitSupportTicket = async (userId, message, rideId = null) => {
  return await addDoc(collection(db, "support"), {
    userId,
    message,
    rideId,
    status: "open",
    createdAt: serverTimestamp(),
  });
};
