import { useEffect, useState } from "react";
import "./Main.css";

import arrow_left from "../assets/icons/chevron-left.svg";
import arrow_right from "../assets/icons/chevron-right.svg";
import cross from "../assets/icons/cross.svg";

interface MonthDay {
    dayNum: number,
    isCurrentMonth: boolean,
    date: Date
}

interface TaskData{
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

    const isLeapYear = (year: number): boolean => {
        return year % 4 === 0;
    }

    const daysInMonth = (month: number, year: number): number => {
        switch (month) {
            case 0:
            case 2:
            case 4:
            case 6:
            case 7:
            case 9:
            case 11:
                return 31;
            case 3:
            case 5:
            case 8:
            case 10:
                return 30;
            case 1:
                return isLeapYear(year) ? 29 : 28;
            default:
                return 0;
        }
    }

    const dayOfWeekSelect = (day: number): string => {
        switch (day) {
            case 0:
                return "SUN";
            case 1:
                return "MON";
            case 2:
                return "TUE";
            case 3:
                return "WED";
            case 4:
                return "THU";
            case 5:
                return "FRI";
            case 6:
                return "SAT";
            default:
                return "ERROR";
        }
    }

    const monthSelect = (monthIndex: number): string => {
        switch(monthIndex){
            case 0:
                return "January";
                break;
            case 1:
                return "February";
                break;
            case 2: 
                return "March";
                break;
            case 3:
                return "April";
                break;
            case 4:
                return "May";
                break;
            case 5:
                return "June";
                break;
            case 6:
                return "July";
                break;
            case 7:
                return "August";
                break;
            case 8:
                return "September";
                break;
            case 9:
                return "October";
                break;
            case 10:
                return "November";
                break;
            case 11:
                return "December";
                break;
            default:
                return "";
                break;
        }
    }

    const renderCalendarMonth = (date: Date) => {
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
                date: new Date(yearOfPreviousMonth, previousMonth, startCountFromPrevMonth + 1)
            });
            startCountFromPrevMonth++;
        }

        for (let i = 1; i <= amountOfDaysInCurrentMonth; i++) {
            monthArr.push({
                dayNum: i,
                isCurrentMonth: true,
                date: new Date(date.getFullYear(), date.getMonth(), i)
            });
        }

        setCurrentMonthArray(monthArr);
    }

    const selectDayColorTheme = (date: Date, currentMonth: boolean): string => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const compareDate = new Date(date);
        compareDate.setHours(0, 0, 0, 0);

        if (today.getTime() === compareDate.getTime()) {
            return "current-day-theme";
        } else if (!currentMonth) {
            return "prev-month-theme";
        } else {
            return "";
        }
    }

    const onLeftArrowClick = () => {
        setCurrentMonth(prevMonth => prevMonth - 1);
    }
    
    const onRightArrowClick = () => {
        setCurrentMonth(prevMonth => prevMonth + 1);
        
    }

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
        currentMilliseconds]);


    const onDatePickerChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const selectedDate = new Date(e.target.value);

        setCurrentYear(selectedDate.getFullYear());
        setCurrentMonth(selectedDate.getMonth());
        setCurrentDay(selectedDate.getDate())
    }

    const onCreateTaskSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

    }

    const moduleWindowOpen = (data?: Partial<TaskData> ) => {


        //const taskDate = `${data?.date.getFullYear()}`

        setTaskData({
            title:"",
            description: "",
            date: "",
            time: "",
            ...data, 
        })

        setIsModuleOpen(true);

        console.log(taskData.date);
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
                        <img src={arrow_left} className="arrow" onClick={onLeftArrowClick}/>
                        <p>{monthSelect(currentDate.getMonth())} {currentDate.getFullYear()}</p>
                        <img src={arrow_right} className="arrow" onClick={onRightArrowClick}/>
                    </div>
                    <input type="date" onChange={onDatePickerChange}/>
                </div>
            </header>
            <section id="calendar">
                <div className="calendar-wrapper">
                    {currentMonthArray.map((item, index) => (
                        <div className={`date-block ${selectDayColorTheme(item.date, item.isCurrentMonth)}`} key={index}
                        onClick={() => moduleWindowOpen({date: item.date.toString()})}>
                            <h4 className="week-day-num">{item.dayNum}</h4>
                            <h4 className="week-day-label">{dayOfWeekSelect(item.date.getDay())}</h4>
                        </div>
                    ))}
                </div>
            </section>
            <section id="module-create-task" className={`${isModuleOpen ? "show" : "hide"}`}>
                    <form className="create-task" onSubmit={onCreateTaskSubmit}>
                        <div className="create-task-title-block">
                            <h2>Create task</h2>
                            <img src={cross} alt="Cross icon" onClick={moduleWindowClose}/>
                        </div>
                        <div className="input-block">
                            <label htmlFor="title">Title</label>
                            <input type="text" name="title" required 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setTaskData({...taskData, title: e.target.value})}}
                            value={taskData.title}/>
                        </div>
                        <div className="input-block">
                            <label htmlFor="description">Description</label>
                            <input type="text" name="description" required 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setTaskData({...taskData, description: e.target.value})}}
                            value={taskData.description}/>
                        </div>
                        <div className="input-block">
                            <label htmlFor="date">Date</label>
                            <input type="date" name="date" required 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setTaskData({...taskData, date: e.target.value})}}
                            value={taskData.date}/>
                        </div>
                        <div className="input-block">
                            <label htmlFor="time">Time</label>
                            <input type="time" name="time" 
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {setTaskData({...taskData, time: e.target.value})}}
                            value={taskData.time}/>
                        </div>
                        <button >Create</button>
                    </form>
            </section>
        </>
    );
}

export default Main;