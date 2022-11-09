const getElement = (name) => document.getElementById(name);
let input_radioEle = document.getElementsByName('input_radio');
const marital_otherEle = getElement('marital_other');

const vform = getElement('validate-form');
const inputEles = document.querySelectorAll('.input-row');
const cellEles = document.querySelectorAll('td');
const result_list = document.createElement('table');
let callApiError = document.createElement('p');
const cancelEdit = document.createElement("a");
const btn_sbt = getElement('btn-validate');
// API url
const apiUrl = 'https://6357f02ec26aac906f36d387.mockapi.io/phuocjs/users';

const getDataForm = () => {
    const marital_otherValue = getElement('marital_other').value;
    const marital_Val = (checkRadio(input_radioEle) == 'Other') ? ((marital_otherValue) ? marital_otherValue : '' ) : checkRadio(input_radioEle);
    const data_firstName = (getElement('last_name').value ? (getElement('first_name').value[0].toUpperCase() + getElement('first_name').value.slice(1)) : '');;
    return {
       firstName: data_firstName,
       lastName: getElement('last_name').value,
       gender: getElement('gender').value,
       age: getElement('age').value,
       phone: getElement('phone').value,
       email: getElement('email').value,
       maritalStatus: marital_Val,
       job: getElement('occupation').value,
       country: getElement('country').value,
       address: getElement('address').value,
       description: getElement('description').value,
       createAt: createDate(),
    }
}

submitValidate = async () => {
    const dataForm = getDataForm();

    Array.from(inputEles).map((ele) =>
        ele.classList.remove('success', 'error'),
    );

    checkValidate(dataForm);

    let label = document.querySelectorAll('.input-row > label');

    if (document.getElementsByClassName('error').length>0) {
        result_list.innerHTML = "";
    } else {
        if (btn_sbt.hasAttribute('data-id')) {
            let data_id = btn_sbt.getAttribute("data-id");
            await fetch(apiUrl+'/'+data_id, {
                method: 'PUT',
                headers: {
                  'Content-type': 'application/json'
                },
                body: JSON.stringify(dataForm)
            });
            callApiError.innerText='';
            callApiError.appendChild(document.createTextNode("Đã lưu!"));
            await vform.insertBefore(callApiError, cancelEdit);
            
        } else {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataForm)
            });
        }
        getDataCall()
    }
};

const maritalDisplay = (marital) => {
    marital_otherEle.parentNode.style.display = marital
}

const genderVal = (sel) => {
    if(sel.value == 'Other') {
        maritalDisplay("block");
    } else {
        maritalDisplay("none");
    }
}

// Check Validate
checkValidate = (getDataForm) => {
    document.querySelectorAll('.small').forEach(e => e.remove());

    if (getDataForm.firstName == '') {
        setError(getElement('first_name'), 'Tên không được để trống');
    } else {
        setSuccess(getElement('first_name'));
    }

    if (getDataForm.lastName == '') {
        setError(getElement('last_name'), 'Họ không được để trống');
    } else {
        setSuccess(getElement('last_name'));
    }

    if (getDataForm.gender == '') {
        setError(getElement('gender'), 'Giới tính không được để trống');
    } else {
        setSuccess(getElement('gender'));
    }

    if (getDataForm.age == '') {
        setError(getElement('age'), 'Tuổi không được để trống');
    } else {
        setSuccess(getElement('age'));
    }

    if (getDataForm.phone == '') {
        setError(getElement('phone'), 'Số điện thoại không được để trống');
    } else if (!isPhone(getDataForm.phone)) {
        setError(getElement('phone'), 'Số điện thoại không đúng định dạng');
    } else {
        setSuccess(getElement('phone'));
    }

    if (getDataForm.email == '') {
        setError(getElement('email'), 'Email không được để trống');
    } else if (!isEmail(getDataForm.email)) {
        setError(getElement('email'), 'Email không đúng định dạng');
    } else {
        setSuccess(getElement('email'));
    }

    let maritalElepr = document.getElementsByClassName("ff-el-input--content");
    if( !checkRadio(input_radioEle)) {
        setError(maritalElepr[0], 'Mục không được để trống');
    } else {
        setSuccess(maritalElepr[0]);
    }

    if (getDataForm.maritalStatus == '') {
        setError(marital_otherEle, 'Mục không được để trống');
    } else {
        setSuccess(marital_otherEle);
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

//get data

const getDataCall = async (compare) => {
    const response = await fetch(apiUrl);
    let datas = await response.json();
    const tbody = document.getElementsByTagName('tbody');

    if (compare == 'age') {
        await datas.sort((a,b) => (a.age > b.age) ? 1 : ((b.age > a.age) ? -1 : 0));
    } else if(compare == 'firstName') {
        await datas.sort((a,b) => (a.firstName > b.firstName) ? 1 : ((b.firstName > a.firstName) ? -1 : 0));
    } else if(compare == '<=20'){
        datas = await datas.filter(({age}) => (age <= 20));
    } else if(compare == '>20'){
        datas = await datas.filter(({age}) => (age > 20));
    } else if(compare == '<50'){
        datas = await datas.filter(({age}) => (age < 50));
    } else if (compare) {
        datas = await datas.filter(({country}) => (country == compare));
    } else {
        await datas.sort((a,b) => 0);
    }

    let dataHtml = datas.map((data) => {
        const data_email = data.email.toLowerCase();
        return `<tr><td>${data.lastName}</td><td>${data.firstName}</td><td>${data.age}</td><td>${data.gender}</td><td>${data.phone}</td><td>${data_email}</td><td>${data.maritalStatus}</td><td>${data.job}</td><td>${data.country}</td><td>${data.address}</td><td>${data.description}</td><td>${data.createAt}</td><td><button class="button btn-delete" data-id="${data.id}" onclick="deleteData(this.getAttribute('data-id'));">Xóa</button><button class="button btn-edit" data-id="${data.id}" onclick="putData(this.getAttribute('data-id'));">Sửa</button></td></tr>`;
    });
    
    tbody[0].innerHTML = dataHtml.join('');

    Array.from(cellEles).map((ele) =>
        ele.classList.remove('loading-animation'),
    );
}

const createDate = () => {
    let today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}

//Delete User
const deleteData = async (data_id) => {
    const answer = window.confirm("Bạn có muốn xóa User?");
    if (answer) {
        let url = apiUrl+'/'+data_id;
        await fetch(url, {
            method: 'DELETE',
        });
        getDataCall();
    }
}

//Update User
const putData = async (data_id) => {
    cancelEdit.innerHTML = "Cancel";
    const radio_marital = document.validateForm.input_radio;

    const response = await fetch(apiUrl+'/'+data_id);
    let datas = await response.json();

    getElement('first_name').value = datas.firstName;
    getElement('last_name').value = datas.lastName;
    getElement('gender').value = datas.gender;
    getElement('age').value = datas.age;
    getElement('phone').value = datas.phone;
    getElement('email').value = datas.email;
    if (datas.maritalStatus == 'Unmarried' || datas.maritalStatus == 'Married') {
        radio_marital.value = datas.maritalStatus;
        maritalDisplay("none");;
    } else {
        radio_marital.value = 'Other';
        marital_otherEle.value = datas.maritalStatus;
        maritalDisplay("block");
    }
    getElement('occupation').value = datas.job;
    getElement('country').value = datas.country;
    getElement('address').value = datas.address;
    getElement('description').value = datas.description;

    await btn_sbt.setAttribute("data-id", data_id);
    await vform.appendChild(cancelEdit);

    await window.scroll({
        top: vform.scrollTop,
        behavior: 'smooth',
    })

    cancelEdit.onclick = await function () {
        const input = document.getElementsByTagName('input');
        const select = document.getElementsByTagName('select');
        const textarea = document.getElementsByTagName('textarea');
        resetValue(input);
        resetValue(select);
        resetValue(textarea);
        btn_sbt.removeAttribute("data-id");
        this.remove()
    }
}

//cancel edit
const resetValue = async (input) => {
    await Array.from(input).map((ele) =>{
        if (ele.type == "radio") {
            ele.checked = false;
            maritalDisplay("none");
        } else {
            ele.value = '';
        }
    });
    callApiError.remove();
}

//filter
const filterBy = async (val) => {
    getDataCall(val); 
}

//show data
getDataCall();