const BASE_URL = "https://open.er-api.com/v6/latest";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const Msg = document.querySelector(".Msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  if (img) img.src = newSrc;
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const from = fromCurr.value;
  const to = toCurr.value;
  const URL = `${BASE_URL}/${from}`;

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error("API fetch failed");

    const data = await response.json();
    const rate = data.rates[to];

    if (!rate) {
      Msg.innerText = `Exchange rate not available for ${from} to ${to}`;
      return;
    }
    const finalAmount = (amtVal * rate).toFixed(2);
    Msg.innerText = `${amtVal} ${from} = ${finalAmount} ${to}`;
  } catch (error) {
    console.error(error);
    Msg.innerText = "Could not fetch exchange rate. Try again later.";
  }
};
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
window.addEventListener("load", () => {
  updateExchangeRate();
});