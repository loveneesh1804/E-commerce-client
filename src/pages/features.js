import moment from "moment";

export const getLastMonths=()=>{
    const today = moment()

    today.date(1);

    const last6Months = [];
    const last12Months = [];

    for (let i = 0; i < 6; i++) {
        const monthDate = today.clone().subtract(i,"months");
        const monthName = monthDate.format("MMMM");

        last6Months.unshift(monthName);
    }

    for (let i = 0; i < 12; i++) {
        const monthDate = today.clone().subtract(i,"months");
        const monthName = monthDate.format("MMMM");

        last12Months.unshift(monthName);
    }

    return {last6Months,last12Months};
}