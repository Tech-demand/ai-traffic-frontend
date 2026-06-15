function Card({title,value}){

return(

<div
style={{
background:"#2563eb",
color:"white",
padding:"20px",
borderRadius:"10px",
width:"220px"
}}
>

<h3>{title}</h3>

<h2>{value}</h2>

</div>

)

}

export default Card;