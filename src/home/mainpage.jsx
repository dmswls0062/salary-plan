import { useState } from "react";
import "./mainpage.css";
import SalaryPU from "./salaryPU.jsx";

function MainPage() {
  const [date, setDate] = useState(new Date());

  const [jobs, setJobs] = useState([]);
  const [schedules, setSchedules] = useState([]);

  const [jobName, setJobName] = useState("");
  const [wage, setWage] = useState("");
  const [jobColor, setJobColor] = useState("#8ec5ff");

  const [selectedJob, setSelectedJob] = useState("");
  const [selectedDay, setSelectedDay] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const [nightPay, setNightPay] = useState(false);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= lastDate; i++) days.push(i);

  const closePopup = () => setIsPopupOpen(false);

  function addJob() {
    if (!jobName || !wage) return;

    setJobs([
      ...jobs,
      {
        id: Date.now(),
        name: jobName,
        wage: Number(wage),
        color: jobColor,
      },
    ]);

    setJobName("");
    setWage("");
  }

  function addSchedule() {
    if (!selectedJob || !selectedDay || !startTime || !endTime) return;

    const job = jobs.find((j) => j.id === Number(selectedJob));
    if (!job) return;

    setSchedules([
      ...schedules,
      {
        id: Date.now(),
        day: selectedDay,
        jobId: job.id,
        jobName: job.name,
        color: job.color,
        start: startTime,
        end: endTime,
        wage: job.wage,
        nightPay,
      },
    ]);

    setStartTime("");
    setEndTime("");
    setSelectedJob("");
    setNightPay(false);
  }

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

  function getNightHours(start, end) {
    const NIGHT_START = 22;
    const NIGHT_END = 6;

    let [sh] = start.split(":").map(Number);
    let [eh] = end.split(":").map(Number);

    let night = 0;
    while (sh !== eh) {
      if (sh >= NIGHT_START || sh < NIGHT_END) night++;
      sh = (sh + 1) % 24;
    }
    return night;
  }

  const totalSalary = schedules.reduce((sum, item) => {
    const totalHours = getTotalHours(item.start, item.end);
    const nightHours = getNightHours(item.start, item.end);

    const normalPay = totalHours * item.wage;
    const nightPayAmount = item.nightPay
      ? nightHours * item.wage * 0.5
      : 0;

    return sum + normalPay + nightPayAmount;
  }, 0);

  return (
    <div className="main-page">
      <h1>💰 월급 플랜 💰</h1>

      <div className="layout">
        <div className="calendar-box">

          {/* 🔥 여기 수정 핵심 */}
          <div className="calendar-title">
            <button
              onClick={() => {
                setDate(new Date(year, month - 1));
                setSchedules([]); // 👈 이전달 이동 시 초기화
              }}
            >
              ◀
            </button>

            <h2>{year}년 {month + 1}월</h2>

            <button
              onClick={() => {
                setDate(new Date(year, month + 1));
                setSchedules([]); // 👈 다음달 이동 시 초기화
              }}
            >
              ▶
            </button>
          </div>

          <div className="week">
            {["일","월","화","수","목","금","토"].map(d => (
              <div key={d}>{d}</div>
            ))}
          </div>

          <div className="days">
            {days.map((day, idx) => {
              const today = schedules.filter(s => s.day === day);

              return (
                <div
                  key={idx}
                  className="day"
                  onClick={() => {
                    if (!day) return;
                    if (!selectedJob) {
                      setSelectedDay(day);
                      setIsPopupOpen(true);
                    }
                  }}
                >
                  <span>{day}</span>

                  <div className="dots">
                    {today.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        className="dot"
                        style={{ background: item.color }}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="right">
          <div className="card">
            <h2>알바 추가</h2>

            <input value={jobName} onChange={e => setJobName(e.target.value)} placeholder="알바 이름" />
            <input type="number" value={wage} onChange={e => setWage(e.target.value)} placeholder="시급" />
            <input type="color" value={jobColor} onChange={e => setJobColor(e.target.value)} />

            <button onClick={addJob}>등록</button>
          </div>

          <div className="card">
            <h2>근무 추가</h2>

            <p>선택 날짜: {selectedDay || "-"} 일</p>

            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
            >
              <option value="">알바 선택</option>
              {jobs.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>

            <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
            <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />

            <label className="check">
              <input
                type="checkbox"
                checked={nightPay}
                onChange={e => setNightPay(e.target.checked)}
              />
              야간수당 적용
            </label>

            <button onClick={addSchedule}>근무 등록</button>
          </div>

          <div className="card">
            <h2>예상 월급</h2>
            <h1>{totalSalary.toLocaleString()}원</h1>
          </div>
        </div>
      </div>

      {isPopupOpen && (
        <SalaryPU
          day={selectedDay}
          schedules={schedules}
          onClose={closePopup}
        />
      )}
    </div>
  );
}

export default MainPage;