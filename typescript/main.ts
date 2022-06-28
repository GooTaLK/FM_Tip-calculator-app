import parseToCents from './utils/parseToCents'

const tipAmountElement = document.querySelector(
  '.tipAmount .mount'
) as HTMLElement
const tipTotalElement = document.querySelector(
  '.tipTotal .mount'
) as HTMLElement
const formElement = document.querySelector(
  '.calculator-form'
) as HTMLFormElement
const billInputElement = document.getElementById('bill') as HTMLInputElement
const peopleInputElement = document.getElementById('people') as HTMLInputElement
const selectTipButtonElements = document.querySelectorAll(
  '.selectTip-button'
) as NodeListOf<HTMLButtonElement>
const selectTipCustomElement = document.querySelector(
  '.selectTip-custom'
) as HTMLButtonElement
const resetButtonElement = document.querySelector(
  '.resetButton-wrapper .button'
) as HTMLButtonElement

type TipData = {
  bill: number
  tipPercent: number
  people: number | ''
  amountPerPerson: number
  totalAmount: number
}

let tipData: TipData = {
  bill: 0,
  tipPercent: 0,
  people: '',
  amountPerPerson: 0,
  totalAmount: 0,
}

function updateTipData({
  bill = tipData.bill,
  tipPercent = tipData.tipPercent,
  people = tipData.people,
}) {
  let totalAmount = 0
  let amountPerPerson = 0

  if (typeof people === 'number' && people > 0 && bill > 0 && tipPercent > 0) {
    totalAmount = (bill * tipPercent) / 100
    amountPerPerson = totalAmount / Math.ceil(people)
  }

  tipData = { bill, tipPercent, people, totalAmount, amountPerPerson }
}

function printInputsWarning() {
  peopleInputElement.parentElement?.classList.toggle(
    'error',
    tipData.people === 0
  )
}

function disableResetButton(disabled = true) {
  disabled
    ? resetButtonElement.setAttribute('disabled', 'true')
    : resetButtonElement.removeAttribute('disabled')
}

function printTipData() {
  tipData.totalAmount === 0 && tipData.amountPerPerson === 0
    ? disableResetButton()
    : disableResetButton(false)

  printInputsWarning()
  tipAmountElement.textContent = parseToCents(tipData.amountPerPerson)
  tipTotalElement.textContent = parseToCents(tipData.totalAmount)
}

function changeTypeOfSelectTipCustom(type: 'button' | 'number') {
  if (type === 'button') {
    selectTipCustomElement.type = 'button'
    selectTipCustomElement.value = 'Custom'
    selectTipCustomElement.setAttribute('min', '0')
    selectTipCustomElement.setAttribute('max', '100')
  } else {
    selectTipCustomElement.type = 'number'
    selectTipCustomElement.value = ''
    selectTipCustomElement.removeAttribute('min')
    selectTipCustomElement.removeAttribute('max')
  }
}

function removeActiveClassOfSibling(target: HTMLElement) {
  target.parentElement?.querySelector('.active')?.classList.remove('active')
}

formElement.addEventListener('submit', (event) => event.preventDefault())

billInputElement.addEventListener('input', ({ target }) => {
  const inputTarget = target as HTMLInputElement
  const bill = Number(inputTarget.value)

  updateTipData({ bill })
  printTipData()
})

peopleInputElement.addEventListener('input', ({ target }) => {
  const inputTarget = target as HTMLInputElement
  const people = inputTarget.value !== '' ? Number(inputTarget.value) : ''

  updateTipData({ people })
  printTipData()
})

selectTipButtonElements.forEach((selectTipButtonElement) => {
  selectTipButtonElement.addEventListener('click', (event) => {
    event.preventDefault()

    const buttonTarget = event.currentTarget as HTMLButtonElement
    const tipPercent = Number(buttonTarget.dataset.tip)

    if (selectTipCustomElement.classList.contains('active')) {
      changeTypeOfSelectTipCustom('button')
      selectTipCustomElement.classList.remove('active')
    } else {
      removeActiveClassOfSibling(buttonTarget)
    }

    buttonTarget.classList.add('active')

    updateTipData({ tipPercent })
    printTipData()
  })
})

selectTipCustomElement.addEventListener('click', ({ currentTarget }) => {
  const inputTarget = currentTarget as HTMLInputElement

  if (inputTarget.classList.contains('active')) return

  removeActiveClassOfSibling(inputTarget)
  changeTypeOfSelectTipCustom('number')
  inputTarget.classList.add('active')

  updateTipData({ tipPercent: 0 })
  printTipData()
})

selectTipCustomElement.addEventListener('input', ({ target }) => {
  const inputTarget = target as HTMLInputElement

  if (!inputTarget.classList.contains('active')) return
  const tipPercent = Number(inputTarget.value)

  updateTipData({ tipPercent })
  printTipData()
})

selectTipCustomElement.addEventListener('blur', ({ target }) => {
  const inputTarget = target as HTMLInputElement
  if (inputTarget.value === '') {
    changeTypeOfSelectTipCustom('button')
    inputTarget.classList.remove('active')
  }
})

resetButtonElement.addEventListener('click', () => {
  updateTipData({ bill: 0, people: '', tipPercent: 0 })
  printTipData()

  if (selectTipCustomElement.classList.contains('active')) {
    changeTypeOfSelectTipCustom('button')
  }
  removeActiveClassOfSibling(selectTipCustomElement)

  billInputElement.value = ''
  peopleInputElement.value = ''
})
