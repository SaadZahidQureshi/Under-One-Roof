

var picker = new Lightpick({
    field: document.getElementById('show-picker'),
    singleDate: false,
    onSelect: function(start, end){
        var str = '';
        str += start ? start.format('MMMM Do YYYY') + '-' : '';
        str += end ? end.format('MMMM Do YYYY') : '...';
        // document.getElementById('button-picker').innerHTML = str;
    }
});


document.querySelector('#show-picker').addEventListener('click', () => {
    document.querySelector('.lightpick__next-action').innerHTML = '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.93066 1.86217L6.06859 6.0001L1.93066 10.138" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    document.querySelector('.lightpick__previous-action').innerHTML = '<svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.06934 10.1379L1.93141 5.99999L6.06934 1.86206" stroke="white" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/></svg>';
})