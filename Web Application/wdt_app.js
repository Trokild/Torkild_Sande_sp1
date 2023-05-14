let employees = [];
let drivers = [];
let carbike = true; //true = car, false = motorbike
let selected = false;
let idxSelect = -1;

function loadEmployee()
{
    fetch('https://randomuser.me/api/?results=5')
    .then(res => res.json())
    .then(data => 
        {
        var empls = data.results;
        for (r = 0; r < empls.length; r++)
        {
            employees.push(employeeLister.createStaff(empls[r]));
        }
        FillScheduleTable();
    });
}
document.onload = loadEmployee();

//#region Staff Board functions
function FillScheduleTable()
{
    table = document.getElementById("staffTable");
    var rows = table.getElementsByTagName('tbody')[0].rows;
    for (let index = 0; index < employees.length; index++) 
    {
        rows[index].cells[0].innerHTML = "<img src=" + employees[index].pic+ ">";
        rows[index].cells[1].innerHTML = employees[index].name;
        rows[index].cells[2].innerHTML = employees[index].surname
        rows[index].cells[3].innerHTML = employees[index].email;
        rows[index].cells[4].innerHTML = employees[index].status
        rows[index].cells[5].innerHTML = " ";
        rows[index].cells[6].innerHTML = " ";
        rows[index].cells[7].innerHTML = " ";
    }
}

function ClockOut(a)
{
    let longout = prompt("Minutes gone:",);
    if(isNaN(longout))
    {
        alert("Invalid");
        return;
    }
    else
    {
        table = document.getElementById("staffTable");
        tBody = table.getElementsByTagName('tbody')[0];

        trs = tBody.getElementsByTagName('tr')[a];
        statu = trs.getElementsByTagName('td')[4];
        outtim = trs.getElementsByTagName('td')[5];
        dur = trs.getElementsByTagName('td')[6];
        expR = trs.getElementsByTagName('td')[7];

        let timer = employees[a].clockOut(longout);

        outtim.innerHTML = timer.timeOut;
        dur.innerHTML = employees[a].duration;
        expR.innerHTML = timer.timeReturn;
        statu.innerHTML = employees[a].status;
    }
}

function ClockInn(b)
{
    employees[b].clockInn();
    console.log(employees[b].name + " has clocked " + employees[b].status);
    table = document.getElementById("staffTable");
    tBody = table.getElementsByTagName('tbody')[0];

    trs = tBody.getElementsByTagName('tr')[b];
    statu = trs.getElementsByTagName('td')[4];
    outtim = trs.getElementsByTagName('td')[5];
    dur = trs.getElementsByTagName('td')[6];
    expR = trs.getElementsByTagName('td')[7];

    outtim.innerHTML = employees[b].outTime;
    dur.innerHTML = employees[b].duration;
    expR.innerHTML = employees[b].exptReturn;
    statu.innerHTML = employees[b].status;
}
//#endregion

//#region Schedule and Delivery function
function Add()
{
    let delint = drivers.length;

    const name = document.getElementById("name").value;
    const surname = document.getElementById("surname").value;
    const phone = document.getElementById("phone").value;
    const address = document.getElementById("addrs").value;
    let returnH = document.getElementById("rtnH").value;
    let returnM = document.getElementById("rtnM").value;

    isValidInput = AddValidator(name, surname, phone, address, returnH, returnM)
    if(!isValidInput){return};
    if(!returnH){returnH = "0"};
    if(!returnM){returnM = "0"};

    const returnT = (('0'+returnH).slice(-2)) +":"+(('0'+returnM).slice(-2));

    table = document.getElementById("deliveryTable");
    tBody = table.getElementsByTagName('tbody')[0];
    trs = tBody.getElementsByTagName('tr')[delint];

    vec = trs.getElementsByTagName('td')[0];
    nam = trs.getElementsByTagName('td')[1];
    sur = trs.getElementsByTagName('td')[2];
    phn = trs.getElementsByTagName('td')[3];
    adr = trs.getElementsByTagName('td')[4];
    rtnt = trs.getElementsByTagName('td')[5];

    drivers.push(employeeLister.createDriver(name,surname,phone,address,returnT));

    let newIco = document.createElement("i");
    if(carbike == true)
    {
        newIco.setAttribute("class","bi bi-car-front");
    }
    else if(carbike == false)
    {
        newIco.setAttribute("class","bi bi-bicycle");     
    }
    vec.appendChild(newIco);

    nam.innerHTML = name;
    sur.innerHTML = surname;
    phn.innerHTML = phone;
    adr.innerHTML = address;
    rtnt.innerHTML = returnT;
    return delint;
}

function Clear(index)
{
    table = document.getElementById("deliveryTable");
    tBody = table.getElementsByTagName('tbody')[0];
    var rows = table.getElementsByTagName('tbody')[0].rows;

    if(drivers.length > 1)
    { 
        for (let i = 0; i < 5; i++) 
        {
            trs = tBody.getElementsByTagName('tr')[i];
            vec = trs.getElementsByTagName('i')[0];
            if(vec !== undefined)
            {
                vec.remove();
            }
            
            rows[i].cells[1].innerHTML = " ";
            rows[i].cells[2].innerHTML = " ";       
            rows[i].cells[3].innerHTML = " ";   
            rows[i].cells[4].innerHTML = " ";   
            rows[i].cells[5].innerHTML = " ";
            let a = ($(".hide")[i]);
            a.style.visibility = 'hidden';    
        }
        drivers.splice(index, 1);;  

        for (let n = 0; n < drivers.length; n++) 
        {
            trs = tBody.getElementsByTagName('tr')[n]
            vec = trs.getElementsByTagName('td')[0];
            console.log(trs);  
            let newIco = document.createElement("i");
            if(drivers[n].vehicle == true)
            {
                newIco.setAttribute("class","bi bi-car-front");
            }
            else if(drivers[n].vehicle == false)
            {
                newIco.setAttribute("class","bi bi-bicycle");     
            }
            vec.appendChild(newIco);

            rows[n].cells[1].innerHTML = drivers[n].name;
            rows[n].cells[2].innerHTML = drivers[n].surname;       
            rows[n].cells[3].innerHTML = drivers[n].telephone;   
            rows[n].cells[4].innerHTML = drivers[n].delivAdrs;   
            rows[n].cells[5].innerHTML = drivers[n].rtnTime;
            let b = ($(".hide")[n]);
            b.style.visibility = 'visible'; 
        }
    }
    else
    {
        trs = tBody.getElementsByTagName('tr')[index];
        vec = trs.getElementsByTagName('i')[0];
        nam = trs.getElementsByTagName('td')[1];
        sur = trs.getElementsByTagName('td')[2];
        phn = trs.getElementsByTagName('td')[3];
        ard = trs.getElementsByTagName('td')[4];
        rt = trs.getElementsByTagName('td')[5]; 
        nam.innerHTML = sur.innerHTML = phn.innerHTML = ard.innerHTML = rt.innerHTML = " ";
        drivers.splice(index, 1);
        vec.remove();
    }

}

function AddValidator(name, sur, phn, adrs, hr, min)
{
    regName = /^[a-zA-Z]{2,}$/;
    if(!regName.test(name))
    {
        alert('Invalid first name');
        return false;
    }

    if(!regName.test(sur) )
    {
        alert('Invalid last name');
        return false;
    }

    regPhn = /^\d{8}$/;
    if (!regPhn.test(phn)) {
        alert('Invalid phone number');
        return false;
    }

    regAdrs = /^[a-zA-Z0-9\s,.'-]{1,}$/;  
    if(!regAdrs.test(adrs))
    {
        alert('Invalid address');
        return false;
    }

    regTim = /^\d{1,}$/;
    if(!regTim.test(hr) || !regTim.test(min) || hr > 23 || min > 59)
    {
        alert('Invalid time');
        return false;
    }
    return true;
}
//#endregion

//#region Toast Notifier
function ToastNotifierStaff(index)
{
    $("#ToastNotifyerStaff").toast('show');

    ToastNotifyer = document.getElementById("ToastNotifyerStaff");
    toastHead = ToastNotifyer.getElementsByTagName('strong')[0];
    toastBody = ToastNotifyer.getElementsByTagName('div')[1];
    toastImg = toastBody.getElementsByTagName('span')[0];

    toastHead.innerHTML = employees[index].name + " " + employees[index].surname;
    toastImg.innerHTML = "<img src=" + employees[index].pic+ ">";

    UpdateToastTimeOut(index); 
}

function ToastNotifierDriver(index)
{
    $("#ToastNotifyerDriver").toast('show');

    ToastNotifyer = document.getElementById("ToastNotifyerDriver");
    toastHead = ToastNotifyer.getElementsByTagName('strong')[0];
    toastBody = ToastNotifyer.getElementsByTagName('div')[1];

    toastHead.innerHTML = drivers[index].name + " " + drivers[index].surname + " is late!";
    toastBody.innerHTML = "Phone: " + drivers[index].telephone + "<br>" +
                          "Address: " + drivers[index].delivAdrs + "<br>" +
                          "Estimated return: " + drivers[index].rtnTime;
    UpdateToastTimeOut(index); 
}

function UpdateToastTimeOut(idx)
{
    date = new Date();

    let nowH = date.getHours();
    let nowM = date.getMinutes();
    emp = employees[idx].exptReturn;
    let ret = emp.split(":");
    let timeGone;

    if(nowH - ret[0] > 1)
    {
        timeGone = (nowH - ret[0]) + " hour and " + (nowM - ret[1] + " mins");
    }
    else
    {
        timeGone = (nowM - ret[1]) + " mins";
    }

    ToastNotifyer = document.getElementById("ToastNotifyerStaff");
    toastHead = ToastNotifyer.getElementsByTagName('strong')[0];
    toastBody = ToastNotifyer.getElementsByTagName('div')[1];
    toastLine = toastBody.getElementsByTagName('span')[1];
    toastLine.innerHTML = " Has been out of office for " + timeGone;
}
//#endregion

//#region Classes
class EmployeeCreator
{
    createStaff(staff)
    {
        let newStaff = new StaffMember();
        newStaff.pic = staff.picture.medium;
        newStaff.name = staff.name.first;
        newStaff.surname = staff.name.last;
        newStaff.email = staff.email;
        newStaff.notifyed = false;
        newStaff.clockInn();
        return newStaff;
    }

    createDriver(name, sur, phn, adrs, rt)
    {
        let newDriver = new DeliveryDriver();
        newDriver.vehicle = carbike;
        newDriver.name = name;
        newDriver.surname = sur;
        newDriver.telephone = phn;
        newDriver.delivAdrs = adrs;
        newDriver.rtnTime = rt;
        return newDriver;
    }
}

class Employee
{
    constructor(name, surname)
    {
        this.name = name;
        this.surname = surname;
    }
}

class StaffMember extends Employee
{
    constructor(pic, email, status, outTime, duration, exptReturn, notifyed)
    {
        super();
        this.pic = pic;
        this.email = email;
        this.status = status;
        this.outTime = outTime;
        this.duration = duration;
        this.exptReturn = exptReturn;
        this.notifyed = notifyed;
    }

    clockInn()
    {
        this.status = "Inn";
        this.outTime = " ";
        this.duration = " ";
        this.exptReturn = " ";
        this.notifyed = false;
    }

    clockOut(timeGone)
    {
        var date = new Date();
        this.status = "Out";
        let nowH = date.getHours();
        let nowM = date.getMinutes();

        let timeOut = (('0'+nowH).slice(-2)) + ":" + (('0'+nowM).slice(-2));
        this.outTime = timeOut;

        let durH = Math.floor(timeGone/60);
        let durM = timeGone % 60;
        this.duration = (('0'+durH).slice(-2)) +":"+(('0'+durM).slice(-2));

        let expM = (durM+nowM) % 60;

        if((durM+nowM) >= 60)
        {
            durH +=1;
        }
        let expH = (durH+nowH) % 24;
        
        let timeReturn = (('0'+expH).slice(-2))+':'+(('0'+expM).slice(-2));
        this.exptReturn = timeReturn;

        return {timeOut, timeReturn};
    }

    staffMemberisLate()
    {
        if(this.status == "Late")
        {
            return true;
        }

        if(this.status == "Out")
        {
            var date = new Date();
            let ret = this.exptReturn.split(":");

            if(date.getHours() > ret[0])
            {
                this.status = "Late";
                return true;
            }
            else if (date.getHours() == ret[0])
            {

                if(date.getMinutes() > ret[1])
                {
                    this.status = "Late";
                    return true;
                }        
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}

class DeliveryDriver extends Employee
{
    constructor(vehicle ,telephone, delivAdrs, rtnTime)
    {
        super();
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.delivAdrs = delivAdrs;
        this.rtnTime = rtnTime;
        this.notifyed = false;
    }

    deliveryDriverisLate()
    {
        var date = new Date();
        let ret = this.rtnTime.split(":");

        if(date.getHours() > ret[0])
        {
            return true;
        }
        else if (date.getHours() == ret[0])
        {

            if(date.getMinutes() > ret[1])
            {
                return true;
            }        
            else
            {
                return false;
            }
        }
        else
        {
            return false;
        }
    }
}
const employeeLister = new EmployeeCreator();
//#endregion

//#region Clock, Check Late
function TimeClock()
{
    var dateT = new Date();

    if(dateT.getDate() < 10)
    {
        var dy = "0" + dateT.getDate();
    }
    else
    {
        var dy = dateT.getDate();
    }

    if(dateT.getMonth() + 1 < 10)
    {
        var mth = "0" + (dateT.getMonth() + 1);
    }
    else
    {
        var mth = dateT.getMonth() + 1;
    }

    var yr = dateT.getFullYear();

    if(dateT.getHours() < 10)
    {
        var hr = "0" + dateT.getHours();
    }
    else
    {
        var hr = dateT.getHours();
    }

    if(dateT.getMinutes() < 10)
    {
        var min = "0" + dateT.getMinutes();
    }
    else
    {
        var min = dateT.getMinutes();
    }


    if(dateT.getSeconds() < 10)
    {
        var sec = "0" + dateT.getSeconds();
    }
    else
    {
        var sec = dateT.getSeconds();
    }
    

    document.getElementById('date').innerHTML = dy + "/" + mth + "/" + yr;
    document.getElementById('time').innerHTML = hr + ":" + min + ":" + sec;
}

function CheckLateInterval()
{
    for (let index = 0; index < employees.length; index++) 
    {
        if(employees[index].staffMemberisLate())
        {
            if(employees[index].notifyed == false)
            {
                table = document.getElementById("staffTable");
                tBody = table.getElementsByTagName('tbody')[0];
                trs = tBody.getElementsByTagName('tr')[index];
                statu = trs.getElementsByTagName('td')[4];
                statu.innerHTML = employees[index].status;
                ToastNotifierStaff(index);
                employees[index].notifyed = true;
            }
            else
            {
                UpdateToastTimeOut(index);
            }
        }
    }

    for (let index = 0; index < drivers.length; index++) 
    {
        if(drivers[index].deliveryDriverisLate())
        {
            if(drivers[index].notifyed == false)
            {
                ToastNotifierDriver(index);
                drivers[index].notifyed = true;
            }
        }  
    }
}

setInterval(TimeClock, 10);
setInterval(CheckLateInterval, 3000);
//#endregion

//#region Selector
$(function()
{
    $("#ClockOutBtn").on("click", (function(){
        if(selected == true)
        {
            ClockOut(idxSelect);
        }
    }));

    $("#ClockInnBtn").on("click", (function(){
        if(selected == true)
        {
            ClockInn(idxSelect);
        }
    }));

    $("#AddBtn").on("click", (function(){
        if(drivers.length < 5)
        {
            let cellDelBrd = ($(".hide")[Add()]);
            if(cellDelBrd){cellDelBrd.style.visibility = 'visible';};
        }
    }));

    $("#ClearBtn").on("click", (function(){
        if(selected == true && drivers.length > 0)
        {
            if(confirm('Are you sure you want to clear driver?'))
            {
                Clear(idxSelect);
            }
        }
    }));

    $('#vecToggle').change(function(){  
        carbike = $(this).prop('checked');
    });

    $("tr").hover(function()
    {
        if($(this).index() != idxSelect && $(this).parent().attr("id") != "noSel" && $(this).attr("id") != "noSel")
        {
            $(this).children('td').css({'background-color' : "#6eb0bd"});
        }
    }, 
    function()
    {
        if(selected == true && $(this).index() != idxSelect && $(this).attr("id") != "noSel")
        {
           $(this).children('td').css("background-color", "#83d1e1");
        }
    });

    $('tr').on('mousedown',function()
    {
        if(selected == true && $(this).index() == idxSelect)
        {
            selected = false;
            idxSelect = -1;
        }
        else if($(this).parent().attr("id") != "noSel" && $(this).attr("id") != "noSel")
        {
            $("td").not(".clear").css({'background-color' : "#83d1e1"});
            idxSelect = $(this).index();
            selected = true;
            $(this).children('td').css({'background-color' : "#0e8ea8"});
        }
    }).on('mouseup mouseleave', function()
    {
        if(selected == false && $(this).attr("id") != "noSel"){
            $(this).children('td').css("background-color", "#83d1e1");
        }
    });

    $("#dashboard").on("click", (function(){
        const dhs = document.getElementById("scheduleTable");
        dhs.scrollIntoView();
    }));
});
//#endregion