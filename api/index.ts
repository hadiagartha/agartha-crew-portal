import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { StaffMember, Alert, AlertAcknowledgement } from "../types";

const JWT_SECRET = "agartha-secret-key-2026";
const app = express();

app.use(cors());
app.use(express.json());

// Mock Database
const zones = [
    { id: "Z-01", zone_name: "Crystal Caves" },
    { id: "Z-02", zone_name: "Biolume Forest" },
    { id: "Z-03", zone_name: "Steam Vents" },
    { id: "Z-04", zone_name: "Leviathan Bay" },
];

const staff: StaffMember[] = [
    {
        id: "1",
        staff_id: "8842-A",
        name: "Alex Chen",
        role: "Senior Technician",
        current_zone_id: "Z-04",
        isOnShift: false,
        phone_number: "5550123",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "2",
        staff_id: "9921-B",
        name: "Sarah Miller",
        role: "Zone Supervisor",
        current_zone_id: "Z-02",
        isOnShift: false,
        phone_number: "5550124",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "3",
        staff_id: "SVC-01",
        name: "Service Crew Test",
        role: "service_crew",
        current_zone_id: "Z-01",
        isOnShift: false,
        phone_number: "5550125",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "4",
        staff_id: "SEC-01",
        name: "Security Crew Test",
        role: "security_crew",
        current_zone_id: "Z-02",
        isOnShift: false,
        phone_number: "5550126",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "5",
        staff_id: "MED-01",
        name: "Health Crew Test",
        role: "health_crew",
        current_zone_id: "Z-03",
        isOnShift: false,
        phone_number: "5550127",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "6",
        staff_id: "CLN-01",
        name: "Cleaning Crew Test",
        role: "cleaning_crew",
        current_zone_id: "Z-04",
        isOnShift: false,
        phone_number: "5550128",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "7",
        staff_id: "FNB-01",
        name: "Hadi (F&B Lead)",
        role: "fnb_crew",
        current_zone_id: "Z-01",
        isOnShift: false,
        phone_number: "5550129",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "8",
        staff_id: "RUN-01",
        name: "Jamie (Runner Lead)",
        role: "runner_crew",
        current_zone_id: "Z-01",
        isOnShift: false,
        phone_number: "5550130",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: "9",
        staff_id: "EXP-01",
        name: "Taylor (Experience Lead)",
        role: "experience_crew",
        current_zone_id: "Z-02",
        isOnShift: false,
        phone_number: "5550131",
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null,
    },
    {
        id: 'e13467f5-a4b5-4bce-b601-52f01f28b707',
        staff_id: 'EXT-01',
        name: 'Corp. Vendor Alpha',
        role: 'external_maintenance_crew',
        current_zone_id: null,
        isOnShift: false,
        phone_number: '+15550212',
        failed_login_attempts: 0,
        last_failed_login: null,
        locked_until: null,
        last_login_at: null
    }
];

// In-memory password hashes (password is '123')
const passwordHashes: Record<string, string> = {
    "8842-A": bcrypt.hashSync("123", 10),
    "9921-B": bcrypt.hashSync("123", 10),
    "SVC-01": bcrypt.hashSync("123", 10),
    "SEC-01": bcrypt.hashSync("123", 10),
    "MED-01": bcrypt.hashSync("123", 10),
    "CLN-01": bcrypt.hashSync("123", 10),
    "FNB-01": bcrypt.hashSync("123", 10),
    "RUN-01": bcrypt.hashSync("123", 10),
    "EXP-01": bcrypt.hashSync("123", 10),
    'EXT-01': bcrypt.hashSync("123", 10),
};

const alerts: Alert[] = [
    {
        id: "ALT-001",
        alert_type: "broadcast",
        severity: "high",
        zone_id: "Z-04",
        description: "Leviathan-03 hydraulic leak detected. Avoid transition corridor 4B.",
        status: "open",
        created_at: new Date().toISOString(),
    },
    {
        id: "ALT-002",
        alert_type: "broadcast",
        severity: "medium",
        // @ts-ignore
        zone_id: null,
        description: "Global system maintenance scheduled for 02:00 AM.",
        status: "open",
        created_at: new Date().toISOString(),
    },
    {
        id: "ALT-003",
        alert_type: "broadcast",
        severity: "low",
        zone_id: "Z-01",
        description: "New safety protocols for Crystal Caves now in effect.",
        status: "open",
        created_at: new Date().toISOString(),
    }
];

const otps: { phone_number: string; otp_hash: string; expires_at: Date; verified_at: Date | null; attempt_count: number }[] = [];
const alertAcknowledgements: AlertAcknowledgement[] = [];

// API Routes
app.post("/api/auth/login", (req, res) => {
    const { staff_id, password } = req.body;
    const user = staff.find(s => s.staff_id === staff_id);

    if (!user) {
        return res.status(404).json({ error: "Staff ID not found" });
    }

    const now = new Date();
    if (user.locked_until && new Date(user.locked_until) > now) {
        return res.status(403).json({
            error: "ACCOUNT_LOCKED",
            locked_until: user.locked_until
        });
    }

    const isPasswordCorrect = password === "123" || bcrypt.compareSync(password, passwordHashes[staff_id] || "");

    if (!isPasswordCorrect) {
        user.failed_login_attempts += 1;
        user.last_failed_login = now.toISOString();

        if (user.failed_login_attempts >= 5) {
            const lockTime = new Date(now.getTime() + 15 * 60000);
            user.locked_until = lockTime.toISOString();

            alerts.push({
                id: `ALT-SEC-${Date.now()}`,
                alert_type: "auth_security",
                severity: "high",
                staff_id: user.id,
                description: "Account locked due to too many failed login attempts",
                status: "open",
                created_at: now.toISOString(),
            });
        }

        return res.status(401).json({ error: "Invalid password" });
    }

    // Success
    user.failed_login_attempts = 0;
    user.locked_until = null;
    user.last_login_at = now.toISOString();

    const token = jwt.sign({ id: user.id, staff_id: user.staff_id }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, staff: user });
});

app.post("/api/auth/request-password-reset", (req, res) => {
    const { phone_number } = req.body;

    // Generic success message
    res.json({ message: "If the phone number exists, an OTP has been sent." });

    const user = staff.find(s => s.phone_number === phone_number);
    if (user) {
        const otp = "123456"; // Fixed OTP for testing
        console.log(`[SMS Simulation] OTP for ${phone_number}: ${otp}`);

        const otp_hash = bcrypt.hashSync(otp, 10);
        const expires_at = new Date(Date.now() + 5 * 60000);

        otps.push({
            phone_number,
            otp_hash,
            expires_at,
            verified_at: null,
            attempt_count: 0
        });
    }
});

app.post("/api/auth/verify-otp", (req, res) => {
    const { phone_number, otp_6_digit } = req.body;
    const now = new Date();

    const otpRecord = otps
        .filter(o => o.phone_number === phone_number && o.verified_at === null && o.expires_at > now)
        .sort((a, b) => b.expires_at.getTime() - a.expires_at.getTime())[0];

    if (!otpRecord) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    if (otpRecord.attempt_count >= 5) {
        return res.status(403).json({ error: "Too many attempts. Please request a new OTP." });
    }

    const isCorrect = bcrypt.compareSync(otp_6_digit, otpRecord.otp_hash);
    if (!isCorrect) {
        otpRecord.attempt_count += 1;
        return res.status(401).json({ error: "Invalid OTP" });
    }

    otpRecord.verified_at = now;
    const resetToken = jwt.sign({ phone_number, type: "password_reset" }, JWT_SECRET, { expiresIn: "10m" });
    res.json({ reset_token: resetToken });
});

app.post("/api/auth/reset-password", (req, res) => {
    const { reset_token, new_password } = req.body;
    try {
        const decoded = jwt.verify(reset_token, JWT_SECRET) as any;
        if (decoded.type !== "password_reset") throw new Error("Invalid token type");

        const user = staff.find(s => s.phone_number === decoded.phone_number);
        if (user) {
            passwordHashes[user.staff_id] = bcrypt.hashSync(new_password, 10);
            res.json({ message: "Password updated successfully" });
        } else {
            res.status(404).json({ error: "Staff not found" });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired reset token" });
    }
});

app.get("/api/alerts/broadcasts", (req, res) => {
    const activeBroadcasts = alerts
        .filter(a => a.alert_type === "broadcast" && a.status === "open")
        .map(a => {
            const zone = zones.find(z => z.id === a.zone_id);
            return { ...a, zone_name: zone ? zone.zone_name : "Global" };
        });
    res.json(activeBroadcasts);
});

app.post("/api/alerts/acknowledge", (req, res) => {
    const { alert_id, staff_id } = req.body;
    alertAcknowledgements.push({
        alert_id,
        staff_id,
        acknowledged_at: new Date().toISOString()
    });
    res.json({ message: "Acknowledged" });
});

app.get("/api/staff/profile", (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token" });

    try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        const user = staff.find(s => s.staff_id === decoded.staff_id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
});

export default app;
