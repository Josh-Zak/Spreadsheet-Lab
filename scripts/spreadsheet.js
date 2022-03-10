$(document).ready(function(){

    // Initialize the IDs for each td cell
    let row = 1;
    let col = 1;
    $('#spreadsheet td').each(function(){
        if(col == 1){
            $(this).attr('id', 'row' + row);
            col++;
            return;
        }
        $(this).attr('id', '' + row + (col-1));
        col++;
        if(col % 5 == 0){
            col = 1;
            row++;
        }
    });

    // Initialize the IDs for each th cell
    col = 1
    $('#spreadsheet th').each(function(){
        if(col == 1){
            col++;
            return;
        }
        $(this).attr('id', 'col' + (col-1));
        col++;
        if(col % 5 == 0){
            col = 1;
            row++;
        }
    });

    // If the top headers are clicked
    $('th:nth-child(n+2)').click(function(){
        deselectAll();
        selectColumn($(this).attr('id'));
    });

    // If the left headers are clicked
    $('td:nth-child(n+1):nth-child(-n+1)').click(function(){
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
    }

    //select everything from colID
    function selectColumn(colID){
        let colIndex = colID.substring(3)
        $('td').each(function(){
            if ($(this).attr('id') % 5 == colIndex){
                $(this).addClass('selected');
            }
        });
    }
});