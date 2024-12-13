const form = document.getElementById("form-search");
const list = document.getElementById("list");
const pagination = document.getElementById("pagination");


const ImgPerPage = 40;
let totalPages ;
let iterator;
let currentPage = 1;


window.onload=()=>{
    form.addEventListener("submit",validateForm);
}

function validateForm(e){
    e.preventDefault();
    const search = document.querySelector("#search").value;


    if(search.trim() == ""){
        ShowAlert("Add your search")
        return;
    }
    currentPage=1;
    searchImages(search);


}

function ShowAlert(message){
    const existalert = document.querySelector(".alert");
    if(existalert){
         existalert.remove();
    }
    const alert = document.createElement("div");
    alert.className = "alert alert-warning alert-dismissible fade show";
    alert.role = "alert";
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    const bar = document.querySelector(".search-bar");
    bar.appendChild(alert);

    setTimeout(() => {
        if (alert) alert.remove();
    }, 5000); 

}


function searchImages(value){

const key = "yourkey";
const url =`https://pixabay.com/api/?key=${key}&q=${value}&per_page=${ImgPerPage}&page=${currentPage}`

    fetch(url).
    then(response=>response.json())
    .then(result=> {
        totalPages = CalculatePages(result.totalHits)
        ShowImages(result.hits)
        ShowPagine();
     })

}
function *createPagine(total){
    for (let i = 1; i <= total; i++) {
        yield i
        
    }
}


function CalculatePages(total){
    return  parseInt(Math.ceil(total / ImgPerPage))
}


function ShowImages(result){
    while(list.firstChild){
        list.removeChild(list.firstChild)
    }
    console.log(result)
    result.forEach(image => {
        const {previewURL,likes,views,largeImageURL}=image;
        const card = document.createElement("div");


        card.className = "col";
        card.innerHTML = `
            <div class="card">
                <img src="${previewURL}" class="card-img-top" alt="Sample Image">
                <div class="card-body">
                    <h5 class="card-title">Likes: ${likes}</h5>
                    <p class="card-text">Views: ${views}</p>
                    <a href="${largeImageURL}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">See Full Image</a>
                </div>
            </div>
        `;
        list.appendChild(card)
    });
}

function ShowPagine(){
    while (pagination.firstChild) {
        pagination.removeChild(pagination.firstChild);
    }


    iterator = createPagine(totalPages);

    while(true){
        const {value,done} = iterator.next();
        if(done)return;

        const button = document.createElement("a");
        button.href= "#";
        button.dataset.page = value;
        button.textContent = value;
        button.className = "btn btn-outline-primary mx-1";
        button.onclick=()=>{
            currentPage = value;
            const search = document.querySelector("#search").value;
            searchImages(search);
            
        }
        pagination.appendChild(button);

    }
}

