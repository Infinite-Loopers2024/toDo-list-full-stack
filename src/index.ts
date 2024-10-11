document.body.style.backgroundColor = "lightblue";

function getTodos() {
  fetch("http://localhost:8080/task")
    .then((response) => response.json())
    .then((toDos) => {
      const container = document.querySelector(".container")!;
      container.innerHTML = "";

      toDos.forEach((todo: { id: number; name: string }) => {
        const bookDiv = document.createElement("div");
        bookDiv.classList.add("books");
        bookDiv.innerHTML = `
        <ul>>${todo.id}</ul>
        <li>${todo.name}</h5>

        `;
        container.appendChild(bookDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}

getTodos();
