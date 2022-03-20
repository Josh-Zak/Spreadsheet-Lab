$(document).ready(function(){

    // Initialize the IDs for each td cell
    let row = 1;
    let col = 1;
    $('#spreadsheet td').each(function(){
        $(this).attr('id', '' + row + (col));
        col++;
        if(col % 4 == 0){
            col = 1;
            row++;
        }
    });

    // Initialize the IDs for each th cell
    col = 1;
    row = 1;
    $('#spreadsheet tr:nth-child(1) th').each(function(){
        if(col == 1){
            col++;
            return;
        }
        $(this).attr('id', 'col' + (col-1));
        col++;
    });
    $('#spreadsheet tr:nth-child(n+2) th').each(function(){
        $(this).attr('id', 'row' + (row));
        row++;
    });

    // If the top headers are clicked
    $('th:nth-child(n+2)').click(function(){
        deselectAll();
        selectColumn($(this).attr('id'));
    });

    // If the left headers are clicked
    $('tr:nth-child(n+2) th').click(function(){
        deselectAll();
        selectRow($(this).attr('id'));
    });


    //deselect everything
    function deselectAll(){
        $('td').removeClass('selected');
    }

    //select everything from rowID
    function selectRow(rowID){
        let rowIndex = rowID.substring(3)
        $('td').each(function(){
            let colVal = $(this).attr('id') % 5;
            if ($(this).attr('id') - colVal == rowIndex * 10){
                $(this).addClass('selected');
            }
        });

        createChart();
    }

    //select everything from colID
    function selectColumn(colID){
        let colIndex = colID.substring(3)
        $('td').each(function(){
            if ($(this).attr('id') % 5 == colIndex){
                $(this).addClass('selected');
            }
        });
        createChart();
    }

    //when td is clicked
    $('td').click(function(){
        deselectAll();

        //save old values
        let value = $(this).text();
        let id = $(this).attr('id');

        var textField = $('<input type="text" />');
        textField.val(value);
        textField.attr('id', id);
        textField.addClass('selected');
        $(this).replaceWith(textField);

        //on ENTER press
        $(textField).keypress(function(event) {
            if (event.which == 13) {
                value = $(this).val();
                
                var td = $('<td></td>');
                td.attr('id', id);
                td.text(value);
                td.addClass('selected');
                $(this).replaceWith(td);
            }
        });

    });


    function createChart(){
        let arr = [];
        var dict = {
            'A': 0,
            'B': 0,
            'C': 0,
            'D': 0,
            'F': 0
        };

        //append to array and add frequency to dict
        $('.selected').each(function(){
            arr.push($(this));
            dict[getGrade($(this).text())] ++;
        });

        //make frequency 0-1
        for(i in dict){
            dict[i] = dict[i]/arr.length;
        }
    }

    function getGrade(mark) {
        if (mark < 50.0) {
            return 'F';
        } else if (mark < 60.0) {
            return 'D';
        } else if (mark < 70.0) {
            return 'C';
        } else if (mark < 80.0) {
            return 'B';
        } else {
            return 'A';
        }
    }

});