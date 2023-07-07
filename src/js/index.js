"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-06-30T14:11:59.604Z",
    "2023-07-02T17:01:17.194Z",
    "2023-07-03T23:36:17.929Z",
    "2023-07-04T10:51:36.790Z",
  ],
  option: {
    style: "currency",
    currency: "RUB",
  },
  locale: "ru-RU",
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  option: {
    style: "currency",
    currency: "USD",
  },
  locale: "en-US",
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  option: {
    style: "currency",
    currency: "EUR",
  },
  locale: "es-PE",
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
  ],
  option: {
    style: "currency",
    currency: "USD",
  },
  locale: "ru-RU",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//script

function createLogIn(accs) {
  accs.forEach((acc) => {
    acc.logIn = acc.owner
      .toLowerCase()
      .split(" ")
      .map((item) => {
        return item[0];
      })
      .join("");
  });
}
createLogIn(accounts);

function updateUi(acc) {
  displayMovements(acc);
  calcPrintBalance(acc);
  calcDisplaySum(acc);
}

function formatMovementsData(date) {
  const option = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const calcDaysPast = function (dateOne, dateTwo) {
    return Math.round((dateOne - dateTwo) / (1000 * 3600 * 24));
  };
  const dayPassed = calcDaysPast(new Date(), date);

  if (dayPassed === 0) return "Сегодня";
  if (dayPassed === 1) return "Вчера";
  if (dayPassed < 5) return `Прошло ${dayPassed} дня`;
  if (dayPassed <= 7) return `Прошло ${dayPassed} дней`;

  return Intl.DateTimeFormat(currentAccount.locale, option).format(date);
}
function formatMovementsMoney(num) {
  return Intl.NumberFormat(currentAccount.locale, currentAccount.option).format(
    num
  );
}

function displayMovements(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((item, index) => {
    const type = item > 0 ? "deposit" : "withdrawal";
    const typeMessage = item > 0 ? "внесение" : "снятие";
    const date = new Date(acc.movementsDates[index]);

    const displayDate = formatMovementsData(date);

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${typeMessage}
          </div>
          <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${Intl.NumberFormat(
            acc.locale,
            acc.option
          ).format(item)}</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce((prev, curr) => {
    return prev + curr;
  });
  labelBalance.textContent = formatMovementsMoney(acc.balance);
}

function calcDisplaySum(acc) {
  const income = acc.movements.filter((e) => e > 0).reduce((p, c) => p + c);
  labelSumIn.textContent = formatMovementsMoney(income);

  const out = acc.movements.filter((e) => e < 0).reduce((p, c) => p + c);
  labelSumOut.textContent = formatMovementsMoney(Math.abs(out));

  labelSumInterest.textContent = formatMovementsMoney(income + out);
}

let currentAccount;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find((e) => e.logIn === inputLoginUsername.value);
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = "1";
    inputLoginPin.value = inputLoginUsername.value = "";
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timeZoneName: "short",
      hour12: false,
    };
    labelDate.textContent = Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(new Date());

    updateUi(currentAccount);
  }
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const reciveAcc = accounts.find((acc) => acc.logIn === inputTransferTo.value);
  const amount = +inputTransferAmount.value;
  if (
    reciveAcc &&
    amount <= currentAccount.balance &&
    amount > 0 &&
    reciveAcc.logIn !== currentAccount.logIn
  ) {
    currentAccount.movements.push(-amount);
    reciveAcc.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    reciveAcc.movementsDates.push(new Date().toISOString());
    inputTransferTo.value = inputTransferAmount.value = "";
    updateUi(currentAccount);
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.logIn &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.logIn === currentAccount.logIn
    );
    accounts.splice(index, 1);
    containerApp.style.opacity = "0";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  if (+inputLoanAmount.value > 0) {
    currentAccount.movements.push(+inputLoanAmount.value);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

const allBalance = accounts
  .map((e) => e.movements)
  .flat()
  .reduce((p, c) => p + c, 0);

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
