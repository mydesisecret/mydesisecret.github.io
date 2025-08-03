<script>
  const storiesPerPage = 8;
  let currentPage = 1;
  let stories = [];

  // Fetch and initialize on load
  async function fetchStories() {
    try {
      const response = await fetch('stories1.json'); // 🔁 changed to stories1.json
      stories = await response.json();
      displayStories();
      displayPagination();
    } catch (err) {
      console.error("Error loading stories:", err);
      document.getElementById('stories').innerHTML = "<p style='color: red;'>Stories not found or JSON format is incorrect.</p>";
    }
  }

  // Display paginated stories
  function displayStories() {
    const startIndex = (currentPage - 1) * storiesPerPage;
    const endIndex = startIndex + storiesPerPage;
    const currentStories = stories.slice(startIndex, endIndex);

    const container = document.getElementById('stories');
    container.innerHTML = '';

    currentStories.forEach(story => {
      const div = document.createElement('div');
      div.setAttribute('role', 'article');
      div.innerHTML = `
        <h3 class="story-title">
          <a href="${story.url || '#'}" title="Read ${story.title || 'Untitled'} - My Desi Secret" target="_blank">
            ${story.title || "कोई शीर्षक नहीं"}
          </a>
        </h3>
        <p class="story-meta">
          🏷️ <strong>${story.category || "अनकैटेगराइज्ड"}</strong><br>
          ✍️ ${story.author || "anonymous"}<br>
          📅 <time datetime="${story.date || ""}">${story.date || "Unknown date"}</time><br>
          📖 ${story.description || "कोई विवरण नहीं"}
        </p>
        <hr/>
      `;
      container.appendChild(div);
    });
  }

  // Display pagination controls
  function displayPagination() {
    const totalPages = Math.ceil(stories.length / storiesPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';
    paginationContainer.setAttribute('aria-label', 'Pagination navigation');

    // ← Previous
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Previous';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        displayStories();
        displayPagination();
      }
    };
    paginationContainer.appendChild(prevBtn);

    // Page Numbers
    const visiblePages = 5;
    const half = Math.floor(visiblePages / 2);
    let start = Math.max(currentPage - half, 1);
    let end = Math.min(start + visiblePages - 1, Math.ceil(stories.length / storiesPerPage));

    if (end - start < visiblePages - 1) {
      start = Math.max(end - visiblePages + 1, 1);
    }

    if (start > 1) {
      paginationContainer.appendChild(createPageButton(1));
      if (start > 2) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.setAttribute('aria-hidden', 'true');
        paginationContainer.appendChild(dots);
      }
    }

    for (let i = start; i <= end; i++) {
      paginationContainer.appendChild(createPageButton(i));
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        const dots = document.createElement('span');
        dots.textContent = '...';
        dots.setAttribute('aria-hidden', 'true');
        paginationContainer.appendChild(dots);
      }
      paginationContainer.appendChild(createPageButton(totalPages));
    }

    // Next →
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayStories();
        displayPagination();
      }
    };
    paginationContainer.appendChild(nextBtn);
  }

  function createPageButton(page) {
    const button = document.createElement('button');
    button.textContent = page;
    button.setAttribute('aria-label', `Go to page ${page}`);
    button.style.margin = '0 4px';
    if (page === currentPage) {
      button.disabled = true;
      button.style.fontWeight = 'bold';
      button.style.backgroundColor = '#800000';
      button.style.color = 'white';
    }
    button.onclick = () => {
      currentPage = page;
      displayStories();
      displayPagination();
    };
    return button;
  }

  // Call the fetch function on page load
  window.onload = fetchStories;
</script>
