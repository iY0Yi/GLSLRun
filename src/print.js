// Define the print function
// ---------------------------------------------------------------
export default function print(){
    let str = Array.prototype.join.call(arguments, " ");
    console.log(str);
    let span = document.createElement('span');
    span.textContent = str + "\n";
    txtAnsw.appendChild(span);
}
window.print = print