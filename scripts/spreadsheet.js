$(document).ready(function(){
    // fetch the .csv data from localhost
    fetch('grades.csv')
        .then((res) => res.text())
        .then(function(data) {
            const lines = data.split('\n'); //each line
            var cells = []; //each value in the csv
            var lineCells; //each value per line

            //loop through each line
            for(let i = 0; i < lines.length; i++){
                lineCells = lines[i].split(',');
                $('#spreadsheet').append('<tr></tr>');

                //loop through each value in the csv file
                for(let j = 0; j < lineCells.length; j++){
                    if(i == 0){
                        $('#spreadsheet tr:nth-child(' + (i+1) + ')').append('<th></th>');
                    }else if(j == 0){
                        $('#spreadsheet tr:nth-child(' + (i+1) + ')').append('<th></th>');
                    }else{
                        $('#spreadsheet tr:nth-child(' + (i+1) + ')').append('<td></td>');
                    }
                    cells.push(lineCells[j]);
                }
            }
            //add the value to the cell
            $("td,th").each(function(i){
                $(this).text(cells[i]);
            })
        })
        .then(function(){
            // Initialize the IDs for each td cell
            let row = 1;
            let col = 1;
            $('td').each(function(){
                $(this).attr('id', '' + row + (col));
                col++;
                if(col % 6 == 0){
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
        })
        .then(function(){
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
                    let colVal = ($(this).attr('id') - 1) % 5 + 1;
                    if ($(this).attr('id') - colVal == rowIndex * 10){
                        $(this).addClass('selected');
                    }
                });

                chartValues();
            }

            //select everything from colID
            function selectColumn(colID){
                let colIndex = colID.substring(3)
                $('td').each(function(){
                    // if ($(this).attr('id') % 5 == colIndex || (colIndex == 5 && $(this).attr('id') % 5 == 0)){
                    if (($(this).attr('id') - 1) % 5 + 1 == colIndex){
                        $(this).addClass('selected');
                    }
                });
                chartValues();
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
        })
        .catch(function(error) {
            console.log(error);
        });


    


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


    function chartValues(){
        let arr = [];
        let dict = [
            {'letter' : 'A' , 'value' : 0},
            {'letter' : 'B' , 'value' : 0},
            {'letter' : 'C' , 'value' : 0},
            {'letter' : 'D' , 'value' : 0},
            {'letter' : 'F' , 'value' : 0},
        ];

        //append to array and add frequency to dict
        $('.selected').each(function(){
            arr.push($(this).text());
            grade = getGrade($(this).text())
            if (grade == 'F') {
                dict[4].value++;
            } else if (grade == 'D') {
                dict[3].value++;
            } else if (grade == 'C') {
                dict[2].value++;
            } else if (grade == 'B') {
                dict[1].value++;
            } else {
                dict[0].value++;    
            }
        });

        //make frequency 0-1
        for(i in dict){
            dict[i].value = dict[i].value/arr.length;
        }

        drawGraph(dict);
    }  
    
    
    function drawGraph(dict){
        $('#barChart').empty();
        const width = 500;
        const height = 500;
        const margin = 50;
        const chartWidth = width - 2*margin; // 700
        const chartHeight = height -2*margin; // 400

        const colourScale = d3.scaleLinear()
                          .domain([0.0, 1.0])
                          .range(['#e0e0ff','blue']);
    
        const xScale = d3.scaleBand()
                        .range([0, chartWidth])
                        .domain(dict.map((data) => data.letter))
                        .padding(0.3);
        
        const yScale = d3.scaleLinear()
                        .range([chartHeight, 0])
                        .domain([0, 1]);
        
        const svg = d3.select('#barChart')
                    .append('svg')
                        .attr('width', width)
                        .attr('height', height);
        
        const canvas = svg.append('g')
                            .attr('transform', `translate(${margin}, ${margin})`);
        
        // chart title
        svg.append('text')
            .attr('x', margin + chartWidth / 2)
            .attr('y', margin)
            .attr('text-anchor', 'middle')
            .text('Grade Distribution');

        // x-axis and label
        canvas.append('g')
                .attr('transform', `translate(${margin}, ${chartHeight})`)
                .call(d3.axisBottom(xScale));

        svg.append('text')
            .attr('x', margin + chartWidth / 2 + margin)
            .attr('y', chartHeight + 2 * margin - 15)
            .attr('text-anchor', 'middle')
            .text('Year');

        // y-axis and label
        canvas.append('g')
                .attr('transform', `translate(${margin}, 0)`)
                .call(d3.axisLeft(yScale));

        svg.append('text')
            .attr('x', -margin + -(chartWidth / 2))
            .attr('y', margin)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Frequency (%)');
        
        // the bar chart
        const bars = canvas.selectAll('rect')
                        .data(dict)
                        .enter()
                            .append('rect')
                                .attr('x', (data) => margin + xScale(data.letter))
                                .attr('y', (data) => yScale(data.value))
                                .attr('height', (data) => (chartHeight - yScale(data.value)))
                                .attr('width', xScale.bandwidth())
                                .attr('fill', (data) => colourScale(data.value))
    }

});