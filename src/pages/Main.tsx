import { useEffect, useState } from "react";
import {
    isLeapYear,
    daysInMonth,
    dayOfWeekSelect,
    monthSelect,
    formatDateNumber,
    selectDayColorTheme
} from "../components/functions";
import "./Main.css";

import arrow_left from "../assets/icons/chevron-left.svg";
import arrow_right from "../assets/icons/chevron-right.svg";
import cross from "../assets/icons/cross.svg";

interface MonthDay {
    dayNum: number,
    isCurrentMonth: boolean,
    date: Date,
    dayTasks: TaskData[]
}

interface TaskData {
    title: string,
    description: string,
    date: string,
    time: string
}

const Main = () => {

    const [currentDay, setCurrentDay] = useState(new Date().getDate());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentHours, setCurrentHours] = useState(new Date().getHours());
    const [currentMinutes, setCurrentMinutes] = useState(new Date().getMinutes());
    const [currentSeconds, setCurrentSeconds] = useState(new Date().getSeconds());
    const [currentMilliseconds, setCurrentMilliseconds] = useState(new Date().getMilliseconds());

    const [currentDate, setCurrentDate] = useState<Date>(new Date(
        currentYear,
        currentMonth,
        currentDay,
        currentHours,
        currentMinutes,
        currentSeconds,
        currentMilliseconds));
    const [currentMonthArray, setCurrentMonthArray] = useState<MonthDay[]>([]);

    const [isModuleOpen, setIsModuleOpen] = useState(false);

    const [taskData, setTaskData] = useState<TaskData>({
        title: "",
        description: "",
        date: "",
        time: ""
    });

    const [taskList, setTaskList] = useState<TaskData[]>([]);

    useEffect(() => {
        const data = localStorage.getItem("TaskList");
        if (data) {
            const jsonData = JSON.parse(data);
            setTaskList(jsonData);

        } else {
            setTaskList([]);
        }
    }, [])

    useEffect(() => {

        const newDate = new Date(
            currentYear,
            currentMonth,
            currentDay,
            currentHours,
            currentMinutes,
            currentSeconds,
            currentMilliseconds
        );

        setCurrentDate(newDate);
        renderCalendarMonth(newDate);

    }, [currentYear,
        currentMonth,
        currentDay,
        currentHours,
        currentMinutes,
        currentSeconds,
        currentMilliseconds,
        taskList]);

    useEffect(() => {
        if (taskList.length > 0) {
            localStorage.setItem("TaskList", JSON.stringify(taskList));
        }
    }, [taskList])

    function renderCalendarMonth(date: Date) {
        const monthArr = [];
        const amountOfDaysInCurrentMonth = daysInMonth(date.getMonth(), date.getFullYear());
        let previousMonth = 0;
        let yearOfPreviousMonth = date.getFullYear();
        let amountOfDaysInPreviousMonth = 0;

        if (date.getMonth() > 0) {
            previousMonth = date.getMonth() - 1;
            yearOfPreviousMonth = date.getFullYear();
            amountOfDaysInPreviousMonth = daysInMonth(previousMonth, date.getFullYear());
        } else if (date.getMonth() === 0) {
            amountOfDaysInPreviousMonth = 31;
            previousMonth = 11;
            yearOfPreviousMonth = date.getFullYear() - 1;
        }

        const restOfDaysInCurrentMonth = 35 - amountOfDaysInCurrentMonth;
        let startCountFromPrevMonth = amountOfDaysInPreviousMonth - restOfDaysInCurrentMonth;


        for (let i = 0; i < restOfDaysInCurrentMonth; i++) {
            monthArr.push({
                dayNum: startCountFromPrevMonth + 1,
                isCurrentMonth: false,
                date: new Date(yearOfPreviousMonth, previousMonth, startCountFromPrevMonth + 1),
                dayTasks: taskList.filter(t => new Date(t.date).getDate() == startCountFromPrevMonth + 1 &&
                    new Date(t.date).getMonth() == previousMonth &&
                    new Date(t.date).getFullYear() == yearOfPreviousMonth)
            });
            startCountFromPrevMonth++;
        }


        for (let i = 1; i <= amountOfDaysInCurrentMonth; i++) {
            monthArr.push({
                dayNum: i,
                isCurrentMonth: true,
                date: new Date(date.getFullYear(), date.getMonth(), i),
                dayTasks: taskList.filter(t => new Date(t.date).getDate() == i &&
                    new Date(t.date).getMonth() == date.getMonth() &&
                    new Date(t.date).getFullYear() == date.getFullYear())
            });
        }

        setCurrentMonthArray(monthArr);
    }

    const onLeftArrowClick = () => {
        setCurrentMonth(prevMonth => prevMonth - 1);
    }

    const onRightArrowClick = () => {
        setCurrentMonth(prevMonth => prevMonth + 1);

    }

    const onDatePickerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const selectedDate = new Date(e.target.value);

        setCurrentYear(selectedDate.getFullYear());
        setCurrentMonth(selectedDate.getMonth());
        setCurrentDay(selectedDate.getDate())
    }

    const onCreateTaskSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        const { title, time, date, description } = taskData;

        if (title != "" &&
            date != "" &&
            description != ""
        ) {
            await setTaskList([...taskList, taskData]);
            setTaskData({
                title: "",
                description: "",
                date: "",
                time: "",
            })

            setIsModuleOpen(false);
        }
    }

    const moduleWindowOpen = (data?: Partial<TaskData>) => {

        const pickedDate = data?.date ? new Date(data?.date) : new Date();
        const formatedDate = `${pickedDate.getFullYear()}-${formatDateNumber(pickedDate.getMonth() + 1)}-${formatDateNumber(pickedDate.getDate())}`

        setTaskData({
            title: "",
            description: "",
            date: formatedDate,
            time: "",
        })

        setIsModuleOpen(true);
    }

    const moduleWindowClose = () => {
        setIsModuleOpen(false);
    }

    return (
        <>
            <header>
                <button className="create-button" onClick={() => moduleWindowOpen()}>+</button>
                <div className="date-pick">
                    <div className="month-select">
                        <img src={arrow_left} className="arrow" onClick={onLeftArrowClick} />
                        <p>{monthSelect(currentDate.getMonth())} {currentDate.getFullYear()}</p>
                        <img src={arrow_right} className="arrow" onClick={onRightArrowClick} />
                    </div>
                    <input type="date" onChange={onDatePickerChange} />
                </div>
            </header>
            <section id="calendar">
                <div className="calendar-wrapper">
                    {currentMonthArray.map((item, index) => (
                        <div className={`date-block ${selectDayColorTheme(item.date, item.isCurrentMonth)}`} key={index}
                            onClick={() => moduleWindowOpen({ date: item.date.toString() })}>
                            <h4 className="week-day-num">{item.dayNum}</h4>
                            <h4 className="week-day-label">{dayOfWeekSelect(item.date.getDay())}</h4>
                            <div className="task-list">
                                {item.dayTasks.length > 0 && item.dayTasks.map(task => (
                                    <div className="task-item">
                                        <p style={{ fontWeight: "bold" }}>{task.title}</p>
                                        <p>{task.time.length > 0 && task.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            <section id="module-create-task" className={`${isModuleOpen ? "show" : "hide"}`}>
                <form className="create-task" onSubmit={onCreateTaskSubmit}>
                    <div className="create-task-title-block">
                        <h2>Create task</h2>
                        <img src={cross} alt="Cross icon" onClick={moduleWindowClose} />
                    </div>
                    <div className="input-block">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" required
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTaskData({ ...taskData, title: e.target.value }) }}
                            value={taskData.title} />
                    </div>
                    <div className="input-block">
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" required
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTaskData({ ...taskData, description: e.target.value }) }}
                            value={taskData.description} />
                    </div>
                    <div className="input-block">
                        <label htmlFor="date">Date</label>
                        <input type="date" name="date" required
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTaskData({ ...taskData, date: e.target.value }) }}
                            value={taskData.date} />
                    </div>
                    <div className="input-block">
                        <label htmlFor="time">Time</label>
                        <input type="time" name="time"
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setTaskData({ ...taskData, time: e.target.value }) }}
                            value={taskData.time} />
                    </div>
                    <button >Create</button>
                </form>
            </section>
        </>
    );
}

export default Main;