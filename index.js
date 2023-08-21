const dropList = document.querySelectorAll(".drop-list select");
const fromCurrency = document.querySelector(".from select");
const toCurrency = document.querySelector(".to select");
const getButton = document.querySelector("form button");

for(let i = 0; i < dropList.length; i++) {
    // selecting USD by default as FROM currency and SDG as TO currency
    for(let country in countries) {
        let get_selected;
        if(i == 0) {
            get_selected = country == 'USD' ? 'selected' : "";
        }else if(i == 1) {
            get_selected = country == 'USD' ? 'selected' : "";
        }
        // Here we're creating an option tag passing the country code as a text and value
        let tag = `<option value = "${country}" ${get_selected}>${country}</option>`;
        dropList[i].insertAdjacentHTML('beforeend', tag);
    }
    dropList[i].addEventListener("change", (e) => {
        loadFlag(e.target); // calling each flag to load as target
    });
}

const loadFlag = (elem) => {
    for(let c in countries) {
        if(c == elem.value) {
             // if the currency code is the option value, then we select an image flag off the the list
             let imageTag = elem.parentElement.querySelector("img");
             imageTag.src = `https://www.countryflagicons.com/SHINY/64/${countries[c]}.png`;
             // we pass the country of a selected currency code in an image url
        }
    }

}

window.addEventListener("load", () => {
    getExchangeRate();
});

getButton.addEventListener('click', (e) => {
    e.preventDefault(); // this prevents the form from submitting
    getExchangeRate();

});

const swapExchangeIcon = document.querySelector(".drop-list .icon");
swapExchangeIcon.addEventListener("click", () => {
    let temp = fromCurrency.value; // currency code of the FROM drop list
    fromCurrency.value = toCurrency.value; // swapping the TO currency code to FROM currency code
    toCurrency.value = temp; // pass the temporary currency to the TO drop list
    loadFlag(fromCurrency);
    loadFlag(toCurrency)
    getExchangeRate();
})


const getExchangeRate = () => {
    const amount = document.querySelector('.amount input');
    const exchangeRateText = document.querySelector(".calculate-exchange-rate");
    let amountValue = amount.value;
    if(amountValue == "" || amountValue == "0") { // if the amount is 0 or none, it will be set to one by default
        amount.value = '1';
        amountValue = 1;
    }
    exchangeRateText.innerText = "Getting exchange rate...";
    // fetching the API response
    let url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency.value}`;
    fetch(url).then(response => response.json()).then(result => {
        let rate = result.conversion_rates[toCurrency.value]; 
        let totalExchange = (amountValue * rate).toFixed(3);
        exchangeRateText.innerText = `${amountValue} ${fromCurrency.value} = ${totalExchange} ${toCurrency.value} `;
   // returns the expected conversion between the selected country code currencies
    }).catch(() => { // if the user types an invalid input while fetching the data, it will catch an error/exception saying that something went wrong.
        exchangeRateText.innerText = "Something's went wrong..";
    })
}