const getElement = (name) => document.getElementById(name);

const last_nameEle = getElement('last_name');
const first_nameEle = getElement('first_name');
const ageEle = getElement('age');
const genderEle = getElement('gender');
const input_radioEle = document.getElementsByName('input_radio');
const marital_otherEle = getElement('marital_other');
const emailEle = getElement('email');
const phoneEle = getElement('phone');

const occupationEle = getElement('occupation');
const countryEle = getElement('country');
const addressEle = getElement('address');
const descriptionEle = getElement('description');

const vform = getElement('validate-form');
const inputEles = document.querySelectorAll('.input-row');
const result_list = document.createElement('div');

submitValidate = () => {
    let last_nameValue = last_nameEle.value;
    let first_nameValue = first_nameEle.value;
    let ageValue = ageEle.value;
    let genderValue = genderEle.value;
    let marital_otherValue = marital_otherEle.value;
    let emailValue = emailEle.value;
    let phoneValue = phoneEle.value;
    let occupationValue = occupationEle.value;
    let countryValue = countryEle.value;
    let addressValue = addressEle.value;
    let descriptionValue = descriptionEle.value;

    Array.from(inputEles).map((ele) =>
        ele.classList.remove('success', 'error'),
    );

    checkValidate();

    let label = document.querySelectorAll('.input-row > label');
    result_list.setAttribute("id", "result-list");

    if (document.getElementsByClassName('error').length>0) {
        result_list.innerHTML = "";
    } else {
        vform.appendChild(result_list);

        let items = [last_nameValue,first_nameValue,ageValue,genderValue,phoneValue,emailValue,checkRadio(input_radioEle),marital_otherValue,occupationValue,countryValue,addressValue,descriptionValue];
        let txt='';
        items.forEach(getValue);
        function getValue(value, index, array) {
            if (value) {
                txt += '<p><span>'+label[index].innerText.replace("*", "")+':</span> '+value + "</p>";
            }
        }
        result_list.innerHTML = txt;
    }
};

const genderVal = (sel) => {
    if(sel.value == 'Other') {
        marital_otherEle.parentNode.style.display = "block";
    } else {
        marital_otherEle.parentNode.style.display = "none";
    }
}

checkValidate = () => {
    let last_nameValue = last_nameEle.value;
    let first_nameValue = first_nameEle.value;
    let ageValue = ageEle.value;
    let genderValue = genderEle.value;
    let marital_otherValue = marital_otherEle.value;
    let emailValue = emailEle.value;
    let phoneValue = phoneEle.value;
    let occupationValue = occupationEle.value;
    let countryValue = countryEle.value;
    let addressValue = addressEle.value;
    let descriptionValue = descriptionEle.value;
    document.querySelectorAll('.small').forEach(e => e.remove());

    if (last_nameValue == '') {
        setError(last_nameEle, 'Họ không được để trống');
    } else {
        setSuccess(last_nameEle);
    }

    if (first_nameValue == '') {
        setError(first_nameEle, 'Tên không được để trống');
    } else {
        setSuccess(first_nameEle);
    }

    if (ageValue == '') {
        setError(ageEle, 'Tuổi không được để trống');
    } else {
        setSuccess(ageEle);
    }

    if (genderValue == '-1') {
        setError(genderEle, 'Giới tính không được để trống');
    } else {
        setSuccess(genderEle);
    }

    let maritalElepr = document.getElementsByClassName("ff-el-input--content");
    if( !checkRadio(input_radioEle)) {
        setError(maritalElepr[0], 'Mục không được để trống');
    } else {
        setSuccess(maritalElepr[0]);
    }

    if (checkRadio(input_radioEle) == 'Other' && marital_otherValue == '') {
        setError(marital_otherEle, 'Mục không được để trống');
    } else {
        setSuccess(marital_otherEle);
    }

    if (emailValue == '') {
        setError(emailEle, 'Email không được để trống');
    } else if (!isEmail(emailValue)) {
        setError(emailEle, 'Email không đúng định dạng');
    } else {
        setSuccess(emailEle);
    }

    if (phoneValue == '') {
        setError(phoneEle, 'Số điện thoại không được để trống');
    } else if (!isPhone(phoneValue)) {
        setError(phoneEle, 'Số điện thoại không đúng định dạng');
    } else {
        setSuccess(phoneEle);
    }
    if (document.getElementsByClassName('error').length>0) {
        document.getElementsByClassName('error')[0].querySelectorAll('input, select')[0].focus();
    }
}

const setSuccess = (ele) => {
    ele.parentNode.classList.add('success');
}

const setError = (ele, message) => {
    let parentEle = ele.parentNode;
    const result_lists = document.createElement('span');
    parentEle.appendChild(result_lists);
    result_lists.classList.add("small");
    parentEle.classList.add('error');
    parentEle.querySelector('.small').innerText = message;
}

const isEmail = (email) => {
    return /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/.test(email);
}

const isPhone = (number) => {
    return /(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(number);
}

const checkRadio = (radio) => {
  for(let i=0; i < radio.length; i++) {
    if(radio[i].checked) return radio[i].value;
  }
  return false;
}