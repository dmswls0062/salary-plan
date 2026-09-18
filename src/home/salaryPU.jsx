import { useState } from "react";
import "./salaryPU.css";

function getTotalHours(start, end) {
  let [sh] = start.split(":").map(Number);
  let [eh] = end.split(":").map(Number);

  let hours = 0;

  while (sh !== eh) {
    hours++;
    sh = (sh + 1) % 24;
  }

  return hours;
}

export default function SalaryPU({ day, schedules, onClose }) {
  const filtered = schedules.filter((s) => s.day === day);

  // 🔥 어떤 카드가 열려있는지 관리
  const [openId, setOpenId] = useState(null);

  return (
    <div className="popup-backdrop">
      <div className="popup-box">
        <h2>{day}일 근무</h2>

        <div className="popup-content">

          {filtered.length === 0 ? (
            <div className="popup-empty">근무 없음</div>
          ) : (
            filtered.map((s) => {
              const total = getTotalHours(s.start, s.end);
              const isOpen = openId === s.id;

              return (
                <div key={s.id} className="popup-row">

                  {/* ================= HEADER ================= */}
                  <div
                    className="popup-header"
                    onClick={() =>
                      setOpenId(isOpen ? null : s.id)
                    }
                  >
                    <div className="left">
                      <span
                        className="color-dot"
                        style={{ background: s.color }}
                      />
                      <span>{s.jobName}</span>
                    </div>

                    <span className="arrow">
                      {isOpen ? "⌄" : "›"}
                    </span>
                  </div>

                  {/* ================= BODY (토글) ================= */}
                  {isOpen && (
                    <div className="popup-body">

                      <div className="line">
                        <span>근무시간</span>
                        <span>{s.start} ~ {s.end}</span>
                      </div>

                      <div className="line">
                        <span>총근무시간</span>
                        <span>{total}시간</span>
                      </div>

                      <div className={`night ${s.nightPay ? "on" : "off"}`}>
                        🌙 야간수당 {s.nightPay ? "적용" : "미적용"}
                      </div>

                    </div>
                  )}

                </div>
              );
            })
          )}

        </div>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}