class Reserved{
    constructor(name, size, price, sizeCM , weight, image) {
        this.name=name;
        this.size=size;
        this.price=price;
        this.sizeCM=sizeCM;
        this.weight=weight;
        this.img=image;
        this.amount=1;
    }
}
let reserved=[];
let typeList=document.querySelectorAll(".typeList span");
for(let i=0; i<typeList.length; i++){
    let type=typeList[i];
    // console.log(typeof(type))
    type.onclick=function(){
        let highNow=document.getElementsByClassName("highlightedType")[0];
        highNow.classList.remove("highlightedType");
        type.classList.add("highlightedType");
        document.getElementsByClassName("all")[0].innerText=type.innerText;
        drawTypePizzas();
    }
}
function generatePizzaItemForLeftPanel(pizza){
    let pizzaItem =ejs.render(`
     <section class="pizzaItem">
                <section class="infoPizza">
                <% if(pizza.is_new) { %>
                       <section class="new status">New</section>
                 <% } %>
                 <% if (pizza.is_popular&&!pizza.is_new) { %>
                   <section class="popular status">Popular</section>
                 <% } %>
                    <section class="imagePizza"><img src="<%= pizza.icon %>" alt="image pizza"/></section>
                    <span class="name"><%=pizza.title %></span>
                    <span class="type"><%= pizza.type %></span>
                    <span class="content"><%= contentOfThePizza(pizza) %> </span>
                </section>
                <section class="properties">
                <% if(pizza.small_size) { %>
                       <section class="prop small">
                          <span class="sizing">
                            <img src="assets/images/size-icon.svg" alt="розмір піци">
                            <label><%= pizza.small_size.size %></label>
                          </span>
                        <span class="sizing">
                            <img src="assets/images/weight.svg" alt="вага піци">
                            <label><%= pizza.small_size.weight %></label>
                        </span>
                        <span class="price"><%= pizza.small_size.price %></span>
                        <span class="priceCurrency">грн.</span>
                        <button class="button buy" onclick="makeReserved('<%= pizza.title%>', 'Мала', '<%= pizza.small_size.price%>', '<%= pizza.small_size.size %>', '<%= pizza.small_size.weight %>','<%= pizza.icon%>')">Купити</button>
                    </section>
                <% } %>
                 
                 <% if(pizza.big_size) { %>
                      <section class="prop big">
                           <span class="sizing">
                            <img src="assets/images/size-icon.svg" alt="розмір піци">
                            <label><%= pizza.big_size.size %></label>
                          </span>
                        <span class="sizing">
                            <img src="assets/images/weight.svg" alt="вага піци">
                            <label><%= pizza.big_size.weight %></label>
                        </span>
                        <span class="price"><%= pizza.big_size.price %></span>
                        <span class="priceCurrency">грн.</span>
                        <button class="button buy" onclick="makeReserved('<%= pizza.title%>', 'Велика', '<%= pizza.big_size.price%>', '<%= pizza.big_size.size %>', '<%= pizza.big_size.weight %>','<%= pizza.icon %>')">Купити</button>
                    </section>
                  <% } %>
            
                </section>
            </section>
    `, {pizza: pizza});

    return pizzaItem;
}
function generatePizzaItemForRightPanel(reservedPizza){
   let newHtml= ejs.render(`
        <section class="listItem">
                <section class="info">
                    <span class="liName"><%= pizza.name %> (<%= pizza.size%>)</span>
                    <span class="sizingBought">
                       <span>
                        <img src="assets/images/size-icon.svg" alt="розмір піци">
                        <label><%= pizza.sizeCM %></label>
                      </span>
                      <span>
                        <img src="assets/images/weight.svg" alt="вага піци">
                         <label><%= pizza.weight %></label>
                      </span>
                     </span>
                    <span class="purse">
                <span class="boughtPrice"><%= pizza.price*pizza.amount %> грн</span>
                 <span>
                     <span class="remove circle ">-</span>
                     <span class="number"><%= pizza.amount%></span>
                     <span class="add circle " >+</span>
                 </span>
                 <span class="delete circle">x</span>
            </span>
                </section>
                <section class="image">
                    <img src="<%= pizza.img%>" alt="Рисунок піци"/>
                </section>
        </section>
    `, {pizza: reservedPizza});
   return newHtml;
}
function makeReserved(name, size, price, sizeCM, weight, image){
    for(let i=0; i<reserved.length; i++){
        if(reserved[i].name===name&&reserved[i].size===size){
            reserved[i].amount++;
            drawRightPanel();
            return;
        }
    }
    reserved.push(new Reserved(name,size,price,sizeCM,weight,image));
    drawRightPanel();
}
function drawRightPanel(){
    let newHtml="";
    let sumaryPrice= 0;
    let amount=0;
    document.getElementsByClassName("listBought")[0].innerHTML="";
    for(let i=0; i<reserved.length; i++){
        newHtml+=generatePizzaItemForRightPanel(reserved[i]);
        sumaryPrice+=reserved[i].amount*reserved[i].price;
        amount+=reserved[i].amount;
    }
    document.getElementById("amountReserved").innerText=String(amount);
    document.getElementsByClassName("listBought")[0].innerHTML=newHtml;
    document.getElementsByClassName("value")[0].innerText=String(sumaryPrice)+ " грн"


}
function contentOfThePizza(pizza){
    let content=[];
    Object.values(pizza.content).forEach(element=>{
        element.forEach(item=>{
            content.push(item);
        })
    })
    content[0]=content[0][0].toUpperCase()+content[0].slice(1);
    return content.join(", ")
}
function drawTypePizzas(){
    document.getElementsByClassName("pizzaList").innerHTML="";
    let newHtml="";
    let numberOfPizzas=0;
    let element= document.getElementsByClassName("highlightedType")[0].innerText;
    for(let i=0; i<pizza_info.length; i++){
        if(element==="М'ясні"&& !pizza_info[i].content.meat){continue;}
        if(element==="З ананасами"&& !pizza_info[i].content.pineapple){continue;}
        if(element==="З грибами" && !pizza_info[i].content.mushroom){continue;}
        if(element==="З морепродуктами" && !pizza_info[i].content.ocean){continue;}
        if(element==="Вега" && pizza_info[i].type !== "Вега піца"){continue;}
        numberOfPizzas++;
        newHtml+=generatePizzaItemForLeftPanel(pizza_info[i]);
    }
    document.getElementsByClassName("pizzaList")[0].innerHTML=newHtml;
    document.getElementById("number").innerText=String(numberOfPizzas);
}
// console.log(contentOfThePizza(pizza_info[0]));
drawRightPanel();
drawTypePizzas();