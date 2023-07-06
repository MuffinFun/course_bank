"use strict";

const account1 = {
  owner: "Dmitrii Fokeev",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  pin: 1111,
};

const account2 = {
  owner: "Anna Filimonova",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  pin: 2222,
};

const account3 = {
  owner: "Polina Filimonova",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  pin: 3333,
};

const account4 = {
  owner: "Stanislav Ivanchenko",
  movements: [430, 1000, 700, 50, 90],
  pin: 4444,
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
  displayMovements(acc.movements);
  calcPrintBalance(acc);
  calcDisplaySum(acc.movements);
}

function displayMovements(movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((item, index) => {
    const type = item > 0 ? "deposit" : "withdrawal";
    const typeMessage = item > 0 ? "внесение" : "снятие";
    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">
            ${index + 1} ${typeMessage}
          </div>
          <div class="movements__date">3 дня назад</div>
          <div class="movements__value">${item}₽</div>
        </div>
        `;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

function calcPrintBalance(acc) {
  acc.balance = acc.movements.reduce((prev, curr) => {
    return prev + curr;
  });
  labelBalance.textContent = acc.balance + "₽";
}

function calcDisplaySum(movements) {
  const income = movements.filter((e) => e > 0).reduce((p, c) => p + c);
  labelSumIn.textContent = income + "₽";

  const out = movements.filter((e) => e < 0).reduce((p, c) => p + c);
  labelSumOut.textContent = Math.abs(out) + "₽";

  labelSumInterest.textContent = income + out + "₽";
}

let currentAccount;

btnLogin.addEventListener("click", (e) => {
  e.preventDefault();
  currentAccount = accounts.find((e) => e.logIn === inputLoginUsername.value);
  if (currentAccount && currentAccount.pin === +inputLoginPin.value) {
    containerApp.style.opacity = "1";
    inputLoginPin.value = inputLoginUsername.value = "";
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
    console.log(index);
    accounts.splice(index, 1);
    containerApp.style.opacity = "0";
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  if (+inputLoanAmount.value > 0) {
    currentAccount.movements.push(+inputLoanAmount.value);
    updateUi(currentAccount);
  }
  inputLoanAmount.value = "";
});

const allBalance = accounts
  .map((e) => e.movements)
  .flat()
  .reduce((p, c) => p + c, 0);
console.log(allBalance);

let sorted = false;
btnSort.addEventListener("click", (e) => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

let clicked = false;

labelBalance.addEventListener("click", () => {
  if (labelBalance.textContent.includes("₽") && !clicked) {
    Array.from(document.querySelectorAll(".movements__value"), (item) => {
      return (item.innerText = item.textContent.replace("₽", "RUB"));
    });

    labelSumIn.innerText = labelSumIn.textContent.replace("₽", "RUB");
    labelSumOut.innerText = labelSumOut.textContent.replace("₽", "RUB");
    labelSumInterest.innerText = labelSumInterest.textContent.replace(
      "₽",
      "RUB"
    );
    labelBalance.innerText = labelBalance.textContent.replace("₽", "RUB");
    clicked = !clicked;
  } else if (labelBalance.textContent.includes("RUB") && clicked) {
    Array.from(document.querySelectorAll(".movements__value"), (item, i) => {
      return (item.innerText = item.textContent.replace("RUB", "₽"));
    });

    labelSumIn.innerText = labelSumIn.textContent.replace("RUB", "₽");
    labelSumOut.innerText = labelSumOut.textContent.replace("RUB", "₽");
    labelSumInterest.innerText = labelSumInterest.textContent.replace(
      "RUB",
      "₽"
    );
    labelBalance.innerText = labelBalance.textContent.replace("RUB", "₽");
    clicked = !clicked;
  }
});

// labelSumIn
// labelSumOut
// labelSumInterest
