const compose = (...functions) => data =>
  functions.reduceRight((value, func) => func(value), data)

/*{
  tag: 'h1',
  attr: {
    class: 'title',
  }
}*/


// const attrsToString = (obj = {}) => {
//   const keys = Object.keys(obj)
//   const attrs = []

//   for (let i = 0; i < keys.length; i++) {
//     let attr = keys[i]
//     attrs.push(`${attr}="${obj[attr]}"`)
//   }

//   const string = attrs.join(' ')

//   return string
// }

const attrsToString = (obj = {}) =>
  Object.keys(obj)
    .map(attr => `${attr}="${obj[attr]}"`)
    .join()

const tagAttrs = obj => (content = '') =>
  `<${obj.tag}${obj.attrs ? ' ' :	 ''}${attrsToString(obj.attrs)}>${content}</${obj.tag}>`

// const tag = t => {
//   if(typeof t === 'string') {
//     return tagAttrs({ tag: t })
//   }
//   return tagAttrs(t)
// }

const tag = (t) => typeof t === 'string' ? tagAttrs({ tag: t }) : tagAttrs(t)

const tableRowTag = tag('tr')
const tableRow = items => compose(tableRowTag, tableCells)(items)

const tableCell = tag('td')
const tableCells = items => items.map(tableCell).join('')

const trashIcon = tag({tag: 'i', attrs: {class: 'fas fa-trash-alt'}})('')

let description = $('#description')
let calories = $('#calories')
let carbs = $('#carbs')
let protein = $('#protein')

let list = []

description.keypress(() => {
  description.removeClass('is-invalid')
})

calories.keypress(() => {
  calories.removeClass('is-invalid')
})

carbs.keypress(() => {
  carbs.removeClass('is-invalid')
})

protein.keypress(() => {
  protein.removeClass('is-invalid')
})

const validateInputs = () => {

  description.val() ? '' : description.addClass('is-invalid')
  calories.val() ? '' : calories.addClass('is-invalid')
  carbs.val() ? '' : carbs.addClass('is-invalid')
  protein.val() ? '' : protein.addClass('is-invalid')

  if(
    description.val() &&
    calories.val() &&
    carbs.val() &&
    protein.val()
  ) add()
}

const add = () => {
  const newItem = {
    description: description.val(),
    calories: parseInt(calories.val()),
    carbs: parseInt(carbs.val()),
    protein: parseInt(protein.val())
  }

  list.push(newItem)
  updateTotals()
  cleanInputs()
  renderItems()

  console.log(list)
}

const updateTotals = () => {
  let calories = 0, carbs = 0, protein = 0

  list.map(item => {
    calories += item.calories,
    carbs += item.carbs,
    protein += item.protein
  })

  $('#totalCalories').text(calories)
  $('#totalCarbs').text(carbs)
  $('#totalProtein').text(protein)
}

const cleanInputs = () => {
  description.val('')
  calories.val('')
  carbs.val('')
  protein.val('')
}

const renderItems = () => {
  $('tbody').empty()

  list.map((item, index) => {

    const removeButton = tag({
      tag: 'button',
      attrs: {
        class: 'btn btn-outline-danger',
        onclick: `removeItem(${index})`
      }
    })(trashIcon)

    $('tbody').append(tableRow([item.description, item.calories, item.carbs, item.protein, removeButton]))
  })
}

const removeItem = (index) => {
  list.splice(index, 1)

  updateTotals()
  renderItems()
}

/* imperativo => que hay que hacer */ 

console.log('-------- imperativo --------')

let arrayImp = [1, 2, 3]

for (let i = 0; i < arrayImp.length; i++) {
  const element = arrayImp[i] * 2;
  console.log(element) 
}

console.log('-------- declarativo --------')

/* declarativo => como hay que hacer */

let arrayDec = [1, 2, 3]

arrayDec.map(elementDos => console.log(elementDos * 2))

console.log('-------- funcion pura --------')

/* funciones algebraicas funcion pura */
/*
  Trabaja cn los valores que le pasamos y siempre son predecibles
*/

// f(x) = 2x

const f = (x) => x*2

/*function f (x) {
  return x*2
}*/

const comparar = (valorUno, valorDos) => valorUno > valorDos

console.log(comparar(5, 6))

console.log(f(4))

console.log('-------- funcion no pura --------')

/* Funcion no pura */

const time = () => new Date().toLocaleTimeString()

console.log(time())

console.log('-------- copiar objetos --------')

/* copiar objetos */

let car = {
  color: "red",
  year: 2019,
  km: 0
}

// Object.assign() recibe 2 parametros la primera donde se va a hacer la copia
// y el segundo es lafuente de los valores
/* nota: Object.assign() sirve para copiar objetos de un solo nivel */

let newCar = Object.assign({}, car)

newCar.year = 2000

console.log(car, newCar)

/* copiando objetos de mas de un nivel */

let carDos = {
  color: "red",
  year: 2019,
  km: 0,
  owner: {
    name: 'Jorge',
    age: 24
  }
}

// JSON.stringify() convierte un objeto en string 
// JSON.parse() convierte string en json

let newCarDos = JSON.parse(JSON.stringify(carDos))

newCarDos.owner.name = 'Juan'

console.log(carDos, newCarDos)

/* inmutabilidad */

const addToList = (list, item, quantity) => {
  list.push(
    {
      item,
      quantity
    }
  )

  return list
}

/* funcion sin mutar esta en una mejor forma de hacerlo */

const addToList2 = (list2, item2, quantity2) => {
  const newList = JSON.parse(JSON.stringify(list2))
  
  newList.push(
    {
      item2,
      quantity2
    }
  )

  return newList
}

// Estado compartido o shared state

const a = {
  value: 2
}

const addOne = () => {
  a.value += 1
} 

const timesTwo = () => {
  a.value *= 2
}

addOne()
timesTwo()

console.log(a.value)

timesTwo()
addOne()

console.log(a.value)


/*  pasando a funciones puras */

/*const b = {
  value: 2
}

const addOne = (b) => {
  Object.assign({}, b, {value: b.value + 1})
} 

const timesTwo = (b) => {
  Object.assign({}, b, {value: b.value * 2})
} 


addOne(b)
timesTwo(b)

console.log(addOne(timesTwo(b)))

console.log(b.value)*/


/* Closures = son funciones que retornan otras funciones y recuerdan el scope en donde fueron creadas */

// function buildSuma(a) {
//   return function (b) {
//     return a+b
//   }
// }

const buildSuma = (a) => (b) => a + b

const addFive = buildSuma(5)
console.log(addFive(5)) // 10

/* Currying */

// function sumThreeNumber (a) {
//   return function (b) {
//     return function (c) {
//       return a + b + c
//     }
//   }
// }

const sumThreeNumber = (a) => (b) => (c) => a + b + c
console.log(sumThreeNumber(1)(2)(3))

/* Introducción a las Higher Order Functions */

const arrayOne = [1, 2, 3]
const arrayDos = []

for (let i = 0; i < arrayOne.length; i++) {
  arrayDos.push(arrayOne[i] * 2)
}

console.log(arrayDos) 

///////////////////////////

const array1 = [1, 2, 3]
const array2 = array1.map(item => item * 2)

console.log(array2)

