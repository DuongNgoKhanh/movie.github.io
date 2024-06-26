//Id variable
var movieId = 1;
var userName = "Thành";

//Rating variables
const ratingInputs = document.querySelectorAll('input[name="rating"]');
const ratingLabels = document.querySelectorAll(".rating label");
var ratingValue = 0;  //Rating value

console.log("ratingInputs: "+ratingInputs);
//comment script
document.addEventListener("DOMContentLoaded", function () {
  const commentForm = document.getElementById("comment-form");
  const commentInput = document.getElementById("comment-input");
  const commentSection = document.getElementById("comment-section");

  //Load và hiển thị danh sách các comment khi trang được tải
  fetch("/comments/" + movieId)
    .then((response) => response.json())
    .then((comments) => {
      comments.forEach((comment) => {
        renderComment(comment);
      });
    })
    .catch((error) => console.error(error));

  // Xử lý sự kiện submit form để gửi comment mới
  commentForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const content = commentInput.value;
    ratingInputs.forEach(input => {
      if(input.checked === true)
        ratingValue = parseInt(input.value);
    })
    if (!content.trim()) return; // Kiểm tra nội dung comment không được để trống
    // Gửi yêu cầu POST để lưu comment mới vào MongoDB
    fetch("/comment/" + movieId, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: content, rating: ratingValue }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Gọi endpoint để lấy thông tin người dùng dựa trên user_id
        //fetch(`/user/${data.user_id}`)
        fetch("/user/" + userName)
          .then((response) => response.json())
          .then((userData) => {
            const comment = {
              content: content,
              user_name: userData.user_name,
              img_path: userData.img_path,
              rating: ratingValue,
              created_at: new Date(),
            };
            //Xóa hover của các ngôi sao
            ratingInputs.forEach((input) => {
              input.checked = false;
            });
            renderComment(comment); // Hiển thị comment mới ngay lập tức
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
    commentInput.value = ""; // Xóa nội dung trong textarea sau khi gửi comment
  });

  // Hàm hiển thị một comment
  function renderComment(comment) {
    //comment view
    var commentView = document.createElement("div");
    commentView.classList.add("comment-view");
    commentSection.appendChild(commentView);

    var userAvatar = document.createElement("img");
    if (comment.img_path == undefined) userAvatar.src = comment.user.img_path;
    else userAvatar.src = comment.img_path;
    userAvatar.alt = "User Avatar";
    commentView.appendChild(userAvatar);

    var afterPic = document.createElement("div");
    afterPic.classList.add("after-pic");
    commentView.appendChild(afterPic);

    var commentInf = document.createElement("div");
    commentInf.setAttribute("class", "comment-inf");
    afterPic.appendChild(commentInf);

    //user name
    var userName = document.createElement("span");
    userName.setAttribute("class", "user-name");
    if (comment.user_name == undefined)
      userName.innerHTML = comment.user.user_name;
    else userName.innerHTML = comment.user_name;
    //userName.content = comment.user_name;
    commentInf.appendChild(userName);

    //rating
    var ratingStar = document.createElement("small");
    ratingStar.setAttribute("class", "rating-star");
    ratingStar.innerHTML = comment.rating + "/5";
    commentInf.appendChild(ratingStar);

    //time
    var date = formatDate(comment.created_at);
    //var date_string = date.format("DD/MM/YYYY");
    var time = document.createElement("small");
    time.setAttribute("class", "time");
    time.innerHTML = date;
    commentInf.appendChild(time);

    //comment content
    var commentContent = document.createElement("p");
    commentContent.setAttribute("class", "comment-content");
    //commentContent.innerHTML = comment.content;
    commentContent.innerHTML = comment.content;
    afterPic.appendChild(commentContent);
  }
});

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = `0${date.getDate()}`.slice(-2);
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
