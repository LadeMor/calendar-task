import { useEffect, useState } from "react";
import "./Main.css";

import arrow_left from "../assets/icons/chevron-left.svg";
import arrow_right from "../assets/icons/chevron-right.svg";

interface MonthDay {
    dayNum: number,
    isCurrentMonth: boolean,
    date: Date
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
        console.log(currentDate);
    }, [currentYear, 
        currentMonth, 
        currentDay, 
        currentHours, 
        currentMinutes, 
        currentSeconds, 
        currentMilliseconds]);


    return (
        <>
            <header>
                <button className="create-button">+</button>
                <div className="date-pick">
                    <div className="month-select">
                        <img src={arrow_left} className="arrow" onClick={onLeftArrowClick}/>
                        <p>September 2024</p>
                        <img src={arrow_right} className="arrow" onClick={onRightArrowClick}/>
                    </div>
                    <input type="date" />
                </div>
            </header>
            <section id="calendar">
                <div className="calendar-wrapper">
                    {currentMonthArray.map((item, index) => (
                        <div className={`date-block ${selectDayColorTheme(item.date, item.isCurrentMonth)}`} key={index}>
                            <h4 className="week-day-num">{item.dayNum}</h4>
                            <h4 className="weed-day-label">{dayOfWeekSelect(item.date.getDay())}</h4>
                        </div>
                    ))}
                </div>
            </section>
        </>
    );
}

export default Main;