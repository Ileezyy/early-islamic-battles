var slider = document.getElementById('slider');

var years_range = {
    'min': [600],
    '50%': [700, 10],
    'max': [800]
};

noUiSlider.create(slider, {
    range: years_range,
    step: 10,
    start: [720, 800],
    orientation: 'vertical',
    behaviour: 'drag',
    connect: true,
    tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
    pips: {
        mode: 'range',
        density: 5
    }
});