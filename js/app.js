firebase.initializeApp({
  apiKey: "AIzaSyDCTiDRye2PMuBkNPQcYx1pXf1_R7Y_G9I",
  authDomain: "node-26693.firebaseapp.com",
  databaseURL: "https://node-26693.firebaseio.com",
  projectId: "node-26693",
  storageBucket: "node-26693.appspot.com",
  messagingSenderId: "640465687011"
})
let ID = _id => document.getElementById(_id)
let Class = _class => document.querySelector(_class)

const Path = firebase.database()
const result = Class('.result')
const measure = Class('.measure')
const retest = Class('.retest')
const status = Class('.status')
const active = Class('.active')
const record = Class('.record')
const secondary = '#424242'
const ideal = '134, 215, 63'
const lighter = '49, 186, 249'
const heavier = '255,152,45'
const mild = '255, 108, 3'
const moderate = '255, 221, 51'
const severe = '255, 18, 0'

let bmi_judge = cal => {
  if (cal < 18.5) {
    color = lighter
    return '過輕'
  } else if (18.5 <= cal && cal < 24) {
    color = ideal
    return '理想'
  } else if (24 <= cal && cal < 27) {
    color = heavier
    return '過重'
  } else if (27 <= cal && cal < 30) {
    color = mild
    return '輕度肥胖'
  } else if (30 <= cal && cal < 35) {
    color = moderate
    return '中度肥胖'
  } else {
    color = severe
    return '重度肥胖'
  }
}

measure.addEventListener('click', e => {
  e.preventDefault
  if (ID('height').value === '' || ID('weight').value === '')
    alert('尚未完成表格')
  else {
    let _date = new Date().getTime()
    let root = 'BMI/' + _date
    let cal = Math.round(ID('weight').value / Math.pow(ID('height').value / 100, 2) * 100, 2) / 100

    Path.ref(root).set({
      'height': ID('height').value,
      'weight': ID('weight').value,
      'date': _date
    })
    result.dataset.text = cal
    retest.classList.remove('hide')
    measure.textContent = ''
    measure.classList.add('hide')
    result.classList.add('active')
    status.textContent = bmi_judge(cal)
    retest.style.backgroundColor = status.style.color = result.style.color = result.style.borderColor = 'rgb(' + color + ')'
  }
}, false)

retest.addEventListener('click', () => {
  result.classList.remove('active')
  status.textContent = ''
  measure.classList.remove('hide')
  measure.textContent = '看結果'
  retest.classList.add('hide')
  ID('height').value = ID('weight').value = ''
}, false)

Path.ref('BMI').on('value', snapshot => {
  let str = ''
  let data = []
  snapshot.forEach(item => { data.push(item.val()) })
  data.reverse()
  for (let item in data) {
    let cm = data[item].height
    let kg = data[item].weight
    let _date = new Date(data[item].date)
    let calDate = (_date.getMonth() + 1) + '-' + _date.getDate() + '-' + _date.getFullYear()
    let cal = Math.round(kg / Math.pow(cm / 100, 2) * 100, 2) / 100
    let judge = bmi_judge(cal)
    str += `<li data-text="${calDate}"
            style="border-left: 3px solid rgb(${color});box-shadow: 2px 0 3px 0 rgba(${color},0.29)">
          <span class="jud">${judge}</span>
          <span class="bmi">${cal}</span>
          <span class="kg">${kg}kg</span>
          <span class="cm">${cm}cm</span>
        </li>`
  }
  record.innerHTML = str
})

ID('weight').addEventListener('keyup', ValidateNumber, false)
ID('height').addEventListener('keyup', ValidateNumber, false)

function ValidateNumber() {
  let str = this.value
  str.split("").forEach(num => {
    if (num < 9 || num > 0) {} else {
      alert('格式錯誤')
      this.value = ''
    }
  })
}