// КАЛЬКУЛЯТОР
// =====================================================================

var maxSumm     = 6000000,  // Максимальная сумма вклада
    minSumm     = 0,        // Минимальная сумма вклада
    startSumm   = 100000,    // Сумма вклада по-умолчанию (первоначальный взнос)
    
    maxRefill   = 1000000,  // Максимальная сумма ежемесячного пополнения
    minRefill   = 0,        // Минимальная сумма ежемесячного пополнения
    startRefill = 20000,    // Ежемесячное пополнение по-умолчанию

    maxTerm     = 24,       // Максимальный срок вклада
    minTerm     = 1,        // Минимальный срок вклада
    startTerm   = 12,       // Срок вклада по-умолчанию

    rate        = 5.5;      // Процентная ставка (годовых)

// =====================================================================

// Считаем доход и проценты
function calcDeposit(summ, mRefill, rate, term) {
    function clearNum(num) { return Number(String(num).replace(/[^0-9]/g, '')) };
    summ    = clearNum(summ);
    mRefill = clearNum(mRefill);
    term    = clearNum(term);

    var mRate = rate / 12,
        deposit = summ;

    for(var i = 0; i < term; i++) {
        i == term - 1 ? refill = 0 : refill = mRefill;
        deposit += deposit * mRate / 100 + refill;
    }

    var percent = deposit - (summ + mRefill * (term - 1));
    deposit = Math.round(deposit);
    percent = Math.round(percent);
    var calcDepo = {
        depo:   deposit,
        perc:   percent
    }
    return calcDepo;
}

// Диаграмма калькулятора
function diagramm(blockID, start, refill, perc) {
    function getRadians(degrees) { 
        return (Math.PI/180)*degrees 
    }
    function createArc(color, width, radius, rad, clockwise) {
        canvasContent.strokeStyle = color;
        canvasContent.lineWidth = width;
        canvasContent.beginPath();
        canvasContent.arc(150, 150, radius, 0, rad, clockwise);
        canvasContent.stroke();
    }
    var canvas          = document.getElementById(blockID),
        borderRad       = getRadians(360),
        startRad        = getRadians(start),
        refillRad       = getRadians(refill),
        percRad         = getRadians(perc),
        canvasContent   = canvas.getContext('2d');
        canvasContent.clearRect(0, 0, 300, 300);

    createArc('#cccccc', 1, 139, borderRad, false);
    createArc('#D8D8D8', 6, 137, -startRad, true);
    createArc('#979797', 6, 137, refillRad, false);
    createArc('#FC6B08', 16, 132, -percRad, true);
}

// Получаем значения слайдов
function getSliders() {
    var curSumm     = $('#bcalc_inputSummLabel').val();
    var curRefill   = $('#bcalc_inputRefillLabel').val();
    var curTerm     = $('#bcalc_inputTermLabel').val();
    var curSliders  = { 
        start: Number(String(curSumm).replace(/[^0-9]/g, '')), 
        refill: Number(String(curRefill).replace(/[^0-9]/g, '')), 
        term: Number(String(curTerm).replace(/[^0-9]/g, '')) 
    }
    return curSliders;
}

// Установка значений полей ручного ввода
function setInputVal(summ, refill, term) {
    var summInput   = $('#bcalc_inputSummLabel');
    var refillInput = $('#bcalc_inputRefillLabel');
    var termInput   = $('#bcalc_inputTermLabel');

    summInput.attr('value', summ);
    refillInput.attr('value', refill);
    termInput.attr('value', term);
}

/*
 * Создание слайдов [ползунков]
 *
 * slideID      : String, ID блока со слкайдом
 * inputID      : String, ID блока со текущим значением слайда
 * minValue     : Int, минимальное значение слайда
 * maxValue     : Int, максимальное значение слайда
 * defaultValue : Int, значение слайда при загрузке калькулятора
 * defaultStep  : Int, шаг с которым изменяется значение слайда при перетаскивании ползунка
 * nonLinear    : Bool, включение/выключение нелинейной зависимости шага
 * rate         : Int, процентная ставка
 * 
 */ 
function createSlides(slideID, inputID, minValue, maxValue, defaultValue, defaultStep, nonLinear, rate) {

    var slideBlock = document.getElementById(slideID);
    var inputBlock = document.getElementById(inputID);

    if(nonLinear) {
        slideRange = {
            min: [minValue],
            '33%': [100000, defaultStep],
            '66%': [maxValue/4, defaultStep],
            max: [maxValue]
        }
    } else {
        slideRange = {
            min: minValue,
            max: maxValue
        }
    }
    noUiSlider.create(slideBlock, {
        connect: [true, false],
        behaviour: 'tap',
        step: defaultStep,
        start: defaultValue,
        range: slideRange
    });
    slideBlock.noUiSlider.on('slide', function(values, handle) {

        var curValue = Math.round(values[handle]);
        inputBlock.value = numDevider(curValue);

        var sliders = getSliders(); 
        var calc = calcDeposit(sliders.start, sliders.refill, rate, sliders.term);

        console.log(month(sliders.term));

        $('.bcalc__resultTermNum').text(month(sliders.term));
        $('.bcalc__resultSumm').text(numDevider(calc.depo));

        var total = sliders.start + sliders.refill * sliders.term;
        summPerc = sliders.start * 100 / total;
        summDeg = 360 / 100 * summPerc;
        refillPerc = (sliders.refill * sliders.term) * 100 / total;
        refillDeg = 360 / 100 * refillPerc;
        percPerc = calc.perc * 100 / total;
        percDeg = 360 / 100 * percPerc;
        diagramm('bcalc__diagrammCanvas', summDeg, refillDeg, percDeg);
    });
    inputBlock.addEventListener('change', function() {

        var manualInput = Number(this.value.replace(/[^0-9]/g, ''));
        if(manualInput > maxValue) manualInput = maxValue;
        if(manualInput < minValue) manualInput = minValue;
        this.value = numDevider(manualInput);
        slideBlock.noUiSlider.set([manualInput, null]);

        var sliders = getSliders(); 
        var calc = calcDeposit(sliders.start, sliders.refill, rate, sliders.term);

        $('.bcalc__resultTermNum').text(month(sliders.term));
        $('.bcalc__resultSumm').text(numDevider(calc.depo));

        var total = sliders.start + sliders.refill * sliders.term;

        summPerc = sliders.start * 100 / total;
        summDeg = 360 / 100 * summPerc;

        refillPerc = (sliders.refill * sliders.term) * 100 / total;
        refillDeg = 360 / 100 * refillPerc;

        percPerc = calc.perc * 100 / total;
        percDeg = 360 / 100 * percPerc;

        diagramm('bcalc__diagrammCanvas', summDeg, refillDeg, percDeg);
    });
}

// Делит число на разряды [ 10503000 => 10 503 000 ] 
function numDevider(data) {
    var res = String(data).replace(/[^0-9]/g, '');
    return res.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
}

// Управление окончанием слова "месяц"
// 1 месяц - 4 месяца - 5 месяцев
function month(num) {
    var month = num + ' месяц';  
    if($.inArray(num, [11,12,13,14]) > -1) {
        month += 'ев';
    } else {
        if($.inArray(num % 10, [2,3,4]) > -1) month += 'а';
        if($.inArray(num % 10, [0,5,6,7,8,9]) > -1) month += 'ев';
    }     
    return month;
}

var summInput   = $('#bcalc_inputSumm');
var refillInput = $('#bcalc_refill');
var termInput   = $('#bcalc_inputTerm');

createSlides('bcalc_inputSumm', 'bcalc_inputSummLabel', minSumm, maxSumm, startSumm, 1000, true, rate);
createSlides('bcalc_inputRefill', 'bcalc_inputRefillLabel', minRefill, maxRefill, startRefill, 1000, true, rate);
createSlides('bcalc_inputTerm', 'bcalc_inputTermLabel', minTerm, maxTerm, startTerm, 1, false, rate);

$(document).ready(function() {

    // Значение по-умолчанию для полей ручного ввода
    setInputVal(numDevider(startSumm), numDevider(startRefill), numDevider(startTerm));

    var sliders = getSliders(); 
    var calc = calcDeposit(sliders.start, sliders.refill, rate, sliders.term);

    $('.calcdepo__percval').text(numDevider(calc.perc));
    $('.calcdepo__termval').text(sliders.term);
    $('.bcalc__resultTermNum').text(month(sliders.term));
    $('.bcalc__resultSumm').text(numDevider(calc.depo));

    var total = sliders.start + sliders.refill * sliders.term;

    summPerc = sliders.start * 100 / total;
    summDeg = 360 / 100 * summPerc;

    refillPerc = (sliders.refill * sliders.term) * 100 / total;
    refillDeg = 360 / 100 * refillPerc;

    percPerc = calc.perc * 100 / total;
    percDeg = 360 / 100 * percPerc;

    diagramm('bcalc__diagrammCanvas', summDeg, refillDeg, percDeg);

});