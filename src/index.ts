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
        <li>${todo.name}</li>

        `;
        container.appendChild(bookDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching books:", error);
    });
}

getTodos();
