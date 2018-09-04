                                     Information about JSON file:
    config_options:
        It is the number of options, including config_options are before the data from the drinks. 
        If any option is added remind to update this value.
        
    drink_amount:
        The different number of available drinks. It is an array index so if it start from 0.
        Ex: if we have 5 different drinks that we can choose, we have to set "drink_amount" to 4.    
        
    opt: 
        The optimal solution for the actual distribution. It is of the format of:
                                    "X0, X1, X2,.."
        Being "Xi" the amount rows that the drink "i" has in the optimal distribution.
        
    countdown:
        The amount of time in secods that the user has to play the game.
        It has to be an integer value.
        
    period_of_time:
        The period of time in days that we use in the game. 
        For simplify it is set to 365 days but it can be changed if wanted.
        
    refill_cost:
        Cost of refilling each time the vending machine.
        It has to be an integer value.
        
    penalty_day_refill:
        Extra penalty to apply if the vending machine needs to be reilled ecah day.
        It has to be an integer value.

    drink_name:
        It contains an array with the name of the drinks. 
        The order of the names is very important because it is the order that they will have in the screen.
        
    drink_img:
        The names of the image files of the drinks.
        The order is very important as they are assigned by order.
            
    <drink_name>: 
        price: The price of the drink. It is recomendable to use one decimal even when it is 0 ( e.g: 3.0)
        capacity: Capacity of the drink in one row. It has to be an integer value and non negative.
        upd: The Units Per Day consumed of this drink. It is recomendable to use only one decimal. 
             It has to be a positive value.       
                  
                                     Rules inside JSON file:
     
    Do NOT change left side values:
        1. price
        2. capacity
        3. upd
        4. drink_amount
        
    Can change left side values with no change, but it is not recomendable:
        1. config_options
        2. drink_amount
        3. opt
        4. Name of the drinks before the data
        
    Do NOT change the order of the options

        
               
