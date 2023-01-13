const commentFormHandler = async (event) => {
  event.preventDefault();

  const comment_text = document.querySelector('#comment-text').value;
  const id = document.querySelector('#id').value;

  if (comment_text && id) {
    const response = await fetch(`/api/comments/${id}`, {
      method: 'POST',
      body: JSON.stringify({ comment_text }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/blogs/${id}`);
    } else {
      alert('Failed to create comment');
      throw new Error(response.statusText);
    }
  }
};

document
  .querySelector('.comment-btn')
  .addEventListener('click', commentFormHandler);


const deleteCommentHandler = async (event) => {
  event.preventDefault();

  const id = event.target.getAttribute("id")

  const response = await fetch(`/api/comments/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
      },
  });
  if (response.ok) {
    document.location.reload()
  } else {
    alert('Failed to delete comment');
    throw new Error(response.statusText);
  }
};

var deleteButtons = document.getElementsByClassName('delete-btn');
console.log(deleteButtons)
for (const button of deleteButtons) {
  button.addEventListener('click', deleteCommentHandler);
}
