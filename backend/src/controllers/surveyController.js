import {sql} from '../db.js';

export const saveSurvey = async (req, res) => {
  const uid = parseInt(req.user.userId, 10);
  if (!Number.isInteger(uid) || uid <= 0 || uid > 2147483647) {
    return res.status(400).json({error: 'InvalidUserID'});
  }
  try {
    await sql`
      INSERT INTO survey_responses (payload, user_id)
      VALUES (
        ${JSON.stringify(req.body)}::jsonb,
        ${uid}
      )
    `;
    return res.status(201).json({ok: true});
  } catch (err) {
    console.error('DB insert failed:', err);
    return res.status(500).json({error: 'DB insert failed'});
  }
};
