(() => {
    const DEBUG = false;
    const LOG = (...args) => console.log(...args);

    const PAYDAY = 26;

    const convertAmount = (s) => Number(s.replace(/[£,]/g, ""));

    const monthDiff = (d1, d2) => {
        let months = (d2.getFullYear() - d1.getFullYear()) * 12 - d1.getMonth() + d2.getMonth();

        if (d2.getDate() >= PAYDAY) {
            months += 1;
        }

        return months <= 0 ? 0 : months;
    };

    const nextPayDay = () => {
        const today = new Date();

        if (today.getDate() > PAYDAY) {
            today.setDate(1);
            today.setMonth(today.getMonth() + 1);
        }

        today.setDate(PAYDAY);

        return today;
    };

    const printIt = (paymentsPerMonth, total) => {
        let calculatedTotal = 0;
        const result = paymentsPerMonth.map(([monthlyRaw, minimumRaw], i) => {
            calculatedTotal += monthlyRaw;
            const dueDate = nextPayDay();
            dueDate.setMonth(dueDate.getMonth() + i);

            const monthly = `£${monthlyRaw.toFixed(2).padStart(8, "\u2000")}`;
            const minimum = `£${minimumRaw.toFixed(2).padStart(8, "\u2000")}`;
            const month = `${dueDate.toLocaleString("default", { month: "long" })}:`;

            return `${month.padEnd(10, " ")}\t${monthly}\t${minimum}`;
        });

        if (result.length) {
            const remainder = total - calculatedTotal;
            if (remainder > 0 && remainder !== calculatedTotal) {
                result.push("", `Remainder: £${remainder.toFixed(2)}`);
            }

            alert(result.join("\n"));
        }
    };

    const doIt = () => {
        const monthlyInstalments = [0, 0, 0, 0];
        const minimumInstalments = [0, 0, 0, 0];

        const entries = document.querySelectorAll('div[data-test-id="expand-collapse-collapsible"]');
        for (entry of entries) {
            const remainingString = entry.querySelector('p[data-test-id="remaining-balance-value"]').firstChild.nodeValue;
            const remaining = convertAmount(remainingString);

            const expiresString = entry.querySelector('p[data-test-id="expires-value"]').firstChild.nodeValue;
            const expiryDate = new Date(expiresString);

            const monthsLeft = monthDiff(nextPayDay(), expiryDate);

            DEBUG && LOG(entry.querySelector('p[data-test="promoContainer_merchantName"]').firstChild.nodeValue, monthsLeft);

            if (monthsLeft <= 0) {
                continue;
            }

            const singleMonthPayment = remaining / monthsLeft;

            for (let i = 0; i < monthsLeft; i++) {
                monthlyInstalments[i] += singleMonthPayment;
            }

            minimumInstalments[monthsLeft - 1] += remaining;
        }

        const totalElement = document.querySelector('p[data-test-id="current-balance-text"]').nextElementSibling;
        const total = totalElement ? convertAmount(totalElement.textContent) : 0;

        const paymentsPerMonth = Array(4).fill();
        for (let i = 0; i < 4; i++) {
            paymentsPerMonth[i] = [monthlyInstalments[i], minimumInstalments[i]];
        }

        printIt(paymentsPerMonth, total);
    };

    doIt();
})();
