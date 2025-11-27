const db = require("../db");

// Simple in-memory cache
let settingsCache = {
  data: null,
  timestamp: null,
  ttl: 5 * 60 * 1000, // 5 minutes
};

// 🔹 Parse any date input safely
const makeDate = (input) => {
  if (!input) return null;
  if (input instanceof Date) return input;
  const date = new Date(input);
  return isNaN(date.getTime()) ? null : date;
};

// 🔹 Compute current semester dynamically based on previous semester end
exports.determineSemester = (settings) => {
  const today = new Date();
  const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const fStart = makeDate(settings.first_sem_start);
  const fEnd = makeDate(settings.first_sem_end);
  const sStart = makeDate(settings.second_sem_start);
  const sEnd = makeDate(settings.second_sem_end);
  const suStart = makeDate(settings.summer_start);
  const suEnd = makeDate(settings.summer_end);

  if (!fStart || !fEnd || !sStart || !sEnd || !suStart || !suEnd) {
    console.error("Invalid semester dates:", settings);
    return { current_semester: "Unknown" };
  }

  if (t >= fStart && t <= fEnd) return { current_semester: "1st" };
  if (t >= sStart && t <= sEnd) return { current_semester: "2nd" };
  if (t >= suStart && t <= suEnd) return { current_semester: "Summer" };

  return { current_semester: "Break" };
};

// 🔹 Get latest settings (with dynamic semester)
exports.getSettings = async (req, res) => {
  try {
    const now = Date.now();

    // ✅ Return cache if valid
    if (settingsCache.data && now - settingsCache.timestamp < settingsCache.ttl) {
      return res.json(settingsCache.data);
    }

    // Fetch from DB
    const [rows] = await db.execute(
      "SELECT * FROM settings ORDER BY setting_id DESC LIMIT 1"
    );

    if (rows.length === 0) return res.status(404).json({ error: "No settings found" });

    const settings = rows[0];
    const { current_semester } = exports.determineSemester(settings);

    const response = {
      ...settings,
      current_semester,
    };

    // Update cache
    settingsCache.data = response;
    settingsCache.timestamp = now;

    res.json(response);
  } catch (err) {
    console.error("Get settings error:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
};

// 🔹 Update settings
exports.updateSettings = async (req, res) => {
  const {
    first_sem_start,
    first_sem_end,
    first_sem_enrollment_start,
    first_sem_enrollment_end,
    second_sem_start,
    second_sem_end,
    second_sem_enrollment_start,
    second_sem_enrollment_end,
    summer_start,
    summer_end,
    current_academic_year
  } = req.body;

  if (
    !first_sem_start || !first_sem_end ||
    !first_sem_enrollment_start || !first_sem_enrollment_end ||
    !second_sem_start || !second_sem_end ||
    !second_sem_enrollment_start || !second_sem_enrollment_end ||
    !summer_start || !summer_end ||
    !current_academic_year
  ) {
    return res.status(400).json({ error: "All semester dates and school year are required" });
  }

  try {
    const [result] = await db.execute(
      `UPDATE settings
        SET first_sem_start = ?, first_sem_end = ?,
            first_sem_enrollment_start = ?, first_sem_enrollment_end = ?,
            second_sem_start = ?, second_sem_end = ?,
            second_sem_enrollment_start = ?, second_sem_enrollment_end = ?,
            summer_start = ?, summer_end = ?,
            current_academic_year = ?, updated_at = CURRENT_TIMESTAMP
        WHERE setting_id = (
          SELECT s.setting_id FROM (SELECT setting_id FROM settings ORDER BY setting_id DESC LIMIT 1) s
        )`,
      [
        first_sem_start, first_sem_end,
        first_sem_enrollment_start, first_sem_enrollment_end,
        second_sem_start, second_sem_end,
        second_sem_enrollment_start, second_sem_enrollment_end,
        summer_start, summer_end,
        current_academic_year
      ]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "No settings found to update" });

    // Clear cache
    settingsCache.data = null;
    settingsCache.timestamp = null;

    res.json({ message: "Settings updated successfully" });
  } catch (err) {
    console.error("Update settings error:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
};

exports.getSettingsInternal = async () => {
  const now = Date.now();

  if (
    settingsCache.data &&
    now - settingsCache.timestamp < settingsCache.ttl
  ) {
    return settingsCache.data;
  }

  const [rows] = await db.execute(
    "SELECT * FROM settings ORDER BY setting_id DESC LIMIT 1"
  );

  const settings = rows[0];
  const { current_semester } = exports.determineSemester(settings);

  const response = {
    ...settings,
    current_semester,
  };

  settingsCache.data = response;
  settingsCache.timestamp = now;

  return response;
};
