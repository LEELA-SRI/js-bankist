'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};
let currentAcc;
const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

let displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';
  let movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (a, b) {
    let typeOfTrans = a > 0 ? 'deposit' : 'withdrawal';
    let htmlString = `
    <div class="movements__row">
          <div class="movements__type movements__type--${typeOfTrans}">${
      b + 1
    } ${typeOfTrans.toUpperCase()}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${a}€</div>
        </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', htmlString);
  });
};

let userName = function (accs) {
  accs.forEach(function (acc) {
    acc.user = acc.owner
      .split(' ')
      .map(a => a[0])
      .join('')
      .toLowerCase();
  });
};
userName(accounts);

let printBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, a) => acc + a, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

let calcDisplaySummary = function (acc) {
  let sumIn = acc.movements.filter(a => a > 0).reduce((acc, a) => acc + a, 0);
  labelSumIn.textContent = `${sumIn}€`;

  let sumOut = acc.movements.filter(a => a < 0).reduce((acc, a) => acc + a, 0);
  labelSumOut.textContent = `${Math.abs(sumOut)}€`;

  let sumInterest = acc.movements
    .filter(a => a > 0)
    .map(a => a * (acc.interestRate / 100))
    .filter(a => a >= 1)
    .reduce((acc, a) => acc + a, 0);
  labelSumInterest.textContent = `${sumInterest}€`;
};

let updateUI = function (acc) {
  //display movements
  displayMovements(currentAcc.movements);
  //display balance
  printBalance(currentAcc);
  //display summary
  calcDisplaySummary(currentAcc);
};

btnLogin.addEventListener('click', function (e) {
  ///prevent form from submitting
  e.preventDefault();
  currentAcc = accounts.find(acc => acc.user === inputLoginUsername.value);
  if (currentAcc?.pin == inputLoginPin.value) {
    //clear input fields
    inputLoginUsername.value =
      inputLoginPin.value =
      inputCloseUsername.value =
      inputClosePin.value =
        '';
    inputLoginPin.blur();
    //display ui and welcome msg
    containerApp.style.opacity = '1';
    labelWelcome.textContent = `Welcome back , ${
      currentAcc.owner.split(' ')[0]
    }`;
    updateUI(currentAcc);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  let receiverName = inputTransferTo.value;
  let transferAmount = Number(inputTransferAmount.value);
  let receiverAcc = accounts.find(acc => acc.user === receiverName);
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();
  if (
    currentAcc.balance >= transferAmount &&
    receiverAcc &&
    receiverAcc?.user != currentAcc.user
  ) {
    currentAcc.movements.push(Number(`-${transferAmount}`));
    receiverAcc.movements.push(transferAmount);
    updateUI(currentAcc);
  } else alert('nah.U aint got that kinda balance');
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  let amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAcc.movements.some(a => a > amount * 0.1)) {
    currentAcc.movements.push(amount);
    updateUI(currentAcc);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  let accountClose = inputCloseUsername.value;

  if (
    accountClose == currentAcc.user &&
    Number(inputClosePin.value) == currentAcc.pin
  ) {
    let index = accounts.findIndex(acc => acc.user === currentAcc.user);
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    console.log(accounts);
  }
});
let sorted=false
btnSort.addEventListener('click', function (e) {
  
  e.preventDefault();
  
  displayMovements(currentAcc.movements, !sorted);
  sorted=!sorted
});
