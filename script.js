const imagesWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".buttons i.bx.bx-x");
const downloadImgBtn = lightBox.querySelector(".buttons i.bx.bx-download")


const apiKey = "QPJuqKqS3e9Vzl6lLf9Yq0hY9WMrExi1rBfvkUaWae2s10UH0zdCjBq7"
const perPage = 15
let currentPage = 1
let searchTerm = null

const downloadImg = (imgURL) =>{
    fetch(imgURL).then(res =>res.blob()).then(file =>{
const a = document.createElement("a")
a.href = URL.createObjectURL(file)
a.download = new Date().getTime()
a.click()
    }).catch(() => alert("failed to dowload this image"))
}

const showLightBox = (name, img) =>{
    lightBox.querySelector("img").src = img
    lightBox.querySelector("span").innerText = name
    downloadImgBtn.setAttribute("data-img", img)
    lightBox.classList.add("show")
    document.body.style.transition = "all 0.5s ease"
    document.body.style.overflow = "hidden"
}

const hideLightBox = () =>{
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto"
}

const generateHTML = (images) =>{
imagesWrapper.innerHTML += images.map(img =>
`   <li class="card" onclick = "showLightBox('${img.photographer}', '${img.src.large2x}')"> 
<img src="${img.src.large2x}">
<div class="details">
    <div class="photographer">
        <i class='bx bx-camera'></i>
        <span>${img.photographer}</span>
    </div>
    <button onclick = "downloadImg('${img.src.large2x}')">
    <i class='bx bx-download'></i>
    </button>
</div>
</li>`
).join("")
}

const getImages = (apiURL) =>{
    loadMoreBtn.innerText = "Loading..."
    loadMoreBtn.classList.add("disabled")
fetch(apiURL, {
    headers: { Authorization: apiKey }
}).then(res => res.json()).then(data => {
     
    generateHTML(data.photos)
    loadMoreBtn.innerText = "Load-More."
    loadMoreBtn.classList.remove("disabled")
}).catch(() => alert("failed to load images"))
}

const loadMoreImages = () =>{
currentPage++
let apiURL = ` https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}&per_page=${perPage}` : apiURL
getImages(apiURL)
}

const loadSearchImages = (e) =>{
    if(e.target.value === "") return searchTerm = null
   if (e.key === "Enter") {
   
    currentPage = 1;
    searchTerm = e.target.value
    imagesWrapper.innerHTML = ""
    getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=1&per_page=${perPage}`)
   }
}


getImages(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`)
loadMoreBtn.addEventListener("click", loadMoreImages)
searchInput.addEventListener("keyup", loadSearchImages)
closeBtn.addEventListener("click", hideLightBox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));