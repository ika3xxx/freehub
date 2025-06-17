document.addEventListener('DOMContentLoaded', () => {
  // Khởi tạo tài khoản mặc định nếu chưa tồn tại
  const initializeDefaultAccounts = () => {
    const defaultAccounts = [
      { username: 'admin', email: 'admin@freehub.vn', password: 'admin123', role: 'admin', fullName: 'Admin', phone: '+84 987 654 321', bio: 'Quản trị viên hệ thống FreeHub, phụ trách giám sát và duy trì hoạt động của nền tảng.' },
      { username: 'freelancer', email: 'freelancer@freehub.vn', password: 'free123', role: 'freelancer', fullName: 'Freelancer', phone: '+84 123 456 789', hourlyRate: 25, skills: 'React.js, JavaScript, Frontend', bio: 'Lập trình viên React.js với 5 năm kinh nghiệm phát triển ứng dụng web, đam mê công nghệ và sáng tạo.' },
      { username: 'client', email: 'client@freehub.vn', password: 'client123', role: 'client', fullName: 'Khách hàng', phone: '+84 456 789 123', needs: 'Cần thuê freelancer phát triển ứng dụng web, thiết kế logo, và quản lý chiến dịch marketing.' }
    ];

    if (!localStorage.getItem('accounts')) {
      localStorage.setItem('accounts', JSON.stringify(defaultAccounts));
    }
  };

  // Khởi tạo danh sách dự án mặc định
  const initializeDefaultProjects = () => {
    const defaultProjects = [
      { id: 1, title: 'Phát triển ứng dụng Mobile', budget: '$1,000 - $2,000', applicants: 5, status: 'Đang hoạt động', client: 'client@freehub.vn' },
      { id: 2, title: 'Thiết kế website bán hàng', budget: '$500 - $800', applicants: 3, status: 'Chờ duyệt', client: 'client@freehub.vn' }
    ];

    if (!localStorage.getItem('projects')) {
      localStorage.setItem('projects', JSON.stringify(defaultProjects));
    }
  };

  // Gọi hàm khởi tạo
  initializeDefaultAccounts();
  initializeDefaultProjects();

  // Lấy các phần tử DOM
  const loginButton = document.getElementById('login-button');
  const registerButton = document.getElementById('register-button');
  const loginModal = document.getElementById('login-modal');
  const registerModal = document.getElementById('register-modal');
  const loginModalClose = document.getElementById('login-modal-close');
  const registerModalClose = document.getElementById('register-modal-close');
  const loginForm = document.getElementById('login-form');
  const profileForm = document.getElementById('profile-form');
  const projectForm = document.getElementById('project-form');
  const ratingForm = document.getElementById('rating-form');
  const profileDropdownButton = document.getElementById('profile-dropdown-button');
  const profileDropdownMenu = document.getElementById('profile-dropdown-menu');
  const logoutButton = document.getElementById('logout-button');
  const profileName = document.getElementById('profile-name');
  const profileTitle = document.getElementById('profile-title');
  const profileRate = document.getElementById('profile-rate');
  const skillsContainer = document.getElementById('skills-container');
  const headerUsername = document.getElementById('header-username');
  const dropdownUsername = document.getElementById('dropdown-username');
  const profileAvatar = document.getElementById('profile-avatar');
  const headerAvatar = document.getElementById('header-avatar');
  const avatarInput = document.getElementById('avatar');
  const avatarPreviewOverlay = document.getElementById('avatar-preview-overlay');
  const applyModal = document.getElementById('apply-modal');
  const applyModalClose = document.getElementById('apply-modal-close');
  const applyForm = document.getElementById('apply-form');
  const coverLetter = document.getElementById('cover-letter');
  const errorCoverLetter = document.getElementById('error-cover-letter');
  const applyButtons = document.querySelectorAll('.apply-project');
  const applicantsModal = document.getElementById('applicants-modal');
  const applicantsModalClose = document.getElementById('applicants-modal-close');
  const viewApplicantsButtons = document.querySelectorAll('.view-applicants');
  const deleteProjectButtons = document.querySelectorAll('.delete-project');
  const acceptApplicantButtons = document.querySelectorAll('.accept-applicant');
  const ratingStars = document.querySelectorAll('.rating-star');
  const ratingInput = document.getElementById('rating');
  const errorFreelancer = document.getElementById('error-freelancer');
  const errorRating = document.getElementById('error-rating');
  const errorReview = document.getElementById('error-review');

  // Hàm chuyển đổi hiển thị modal
  function toggleModal(modal, show) {
    if (modal) {
      if (show) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
      } else {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
      }
    }
  }

  // Tải thông tin hồ sơ từ localStorage
  const loadProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      // Cập nhật header và dropdown
      if (headerUsername) headerUsername.textContent = currentUser.fullName || 'Người dùng';
      if (dropdownUsername) dropdownUsername.textContent = currentUser.fullName || 'Người dùng';
      if (headerAvatar && currentUser.avatar) headerAvatar.src = currentUser.avatar;
      if (profileAvatar && currentUser.avatar) profileAvatar.src = currentUser.avatar;

      // Cập nhật form hồ sơ
      if (profileForm) {
        const nameInput = document.getElementById('name') || document.getElementById('full-name');
        if (nameInput) nameInput.value = currentUser.fullName || '';
        if (document.getElementById('email')) document.getElementById('email').value = currentUser.email || '';
        if (document.getElementById('phone')) document.getElementById('phone').value = currentUser.phone || '';
        if (document.getElementById('hourly-rate')) document.getElementById('hourly-rate').value = currentUser.hourlyRate || '';
        const skillsInput = document.getElementById('skills');
        if (skillsInput) skillsInput.value = currentUser.skills || '';
        const descriptionInput = document.getElementById('description') || document.getElementById('bio');
        if (descriptionInput) descriptionInput.value = currentUser.bio || '';
        if (document.getElementById('needs')) document.getElementById('needs').value = currentUser.needs || '';
      }

      // Cập nhật hiển thị hồ sơ
      if (profileName) profileName.textContent = currentUser.fullName || 'Người dùng';
      if (profileTitle) {
        profileTitle.textContent = currentUser.role === 'admin' ? 'Quản trị viên hệ thống' : 
                                  currentUser.role === 'freelancer' ? 'Lập trình viên React.js' : 
                                  'Khách hàng dự án';
      }
      if (profileRate && currentUser.hourlyRate) profileRate.textContent = `$${currentUser.hourlyRate} / giờ`;
      if (skillsContainer && currentUser.skills) {
        const skills = currentUser.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
        skillsContainer.innerHTML = skills.map(skill => `
          <span class="bg-indigo-200 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">${skill}</span>
        `).join('');
      }
    }
  };

  // Xử lý đăng nhập
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
      const user = accounts.find(acc => acc.email === email && acc.password === password);

      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        toggleModal(loginModal, false);
        switch (user.role) {
          case 'admin':
            window.location.href = 'html/admin.html';
            break;
          case 'freelancer':
            window.location.href = 'html/freelancer-dashboard.html';
            break;
          case 'client':
            window.location.href = 'html/client-dashboard.html';
            break;
          default:
            alert('Vai trò không hợp lệ!');
        }
      } else {
        alert('Email hoặc mật khẩu không đúng!');
      }
    });
  }

  // Xử lý lưu hồ sơ
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const nameInput = document.getElementById('name') || document.getElementById('full-name');
        const descriptionInput = document.getElementById('description') || document.getElementById('bio');
        const updatedUser = {
          ...currentUser,
          fullName: nameInput ? nameInput.value.trim() : currentUser.fullName,
          email: document.getElementById('email') ? document.getElementById('email').value.trim() : currentUser.email,
          phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : currentUser.phone,
          hourlyRate: document.getElementById('hourly-rate') ? parseFloat(document.getElementById('hourly-rate').value) : currentUser.hourlyRate,
          skills: document.getElementById('skills') ? document.getElementById('skills').value.trim() : currentUser.skills,
          bio: descriptionInput ? descriptionInput.value.trim() : currentUser.bio,
          needs: document.getElementById('needs') ? document.getElementById('needs').value.trim() : currentUser.needs
        };

        // Xử lý CV nếu có
        const cvInput = document.getElementById('cv');
        if (cvInput && cvInput.files[0]) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            updatedUser.cv = ev.target.result;
            updateUserData(updatedUser);
          };
          reader.readAsDataURL(cvInput.files[0]);
        } else {
          updateUserData(updatedUser);
        }

        function updateUserData(user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
          const updatedAccounts = accounts.map(acc => acc.email === user.email ? user : acc);
          localStorage.setItem('accounts', JSON.stringify(updatedAccounts));

          // Cập nhật giao diện
          if (headerUsername) headerUsername.textContent = user.fullName || 'Người dùng';
          if (dropdownUsername) dropdownUsername.textContent = user.fullName || 'Người dùng';
          if (profileName) profileName.textContent = user.fullName || 'Người dùng';
          if (profileRate && user.hourlyRate) profileRate.textContent = `$${user.hourlyRate} / giờ`;
          if (skillsContainer && user.skills) {
            const skills = user.skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
            skillsContainer.innerHTML = skills.map(skill => `
              <span class="bg-indigo-200 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full shadow-sm">${skill}</span>
            `).join('');
          }

          alert('Thông tin hồ sơ đã được lưu thành công!');
        }
      }
    });
  }

  // Xử lý thay đổi ảnh đại diện
  if (avatarInput && avatarPreviewOverlay) {
    avatarPreviewOverlay.addEventListener('click', () => {
      avatarInput.click();
    });
    avatarInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (profileAvatar) profileAvatar.src = ev.target.result;
          if (headerAvatar) headerAvatar.src = ev.target.result;
          const currentUser = JSON.parse(localStorage.getItem('currentUser'));
          if (currentUser) {
            currentUser.avatar = ev.target.result;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            const accounts = JSON.parse(localStorage.getItem('accounts')) || [];
            const updatedAccounts = accounts.map(acc => acc.email === currentUser.email ? currentUser : acc);
            localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Xử lý dropdown menu
  if (profileDropdownButton && profileDropdownMenu) {
    profileDropdownButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = profileDropdownButton.getAttribute('aria-expanded') === 'true';
      profileDropdownMenu.classList.toggle('hidden', expanded);
      profileDropdownButton.setAttribute('aria-expanded', !expanded);
    });
    document.addEventListener('click', () => {
      if (!profileDropdownMenu.classList.contains('hidden')) {
        profileDropdownMenu.classList.add('hidden');
        profileDropdownButton.setAttribute('aria-expanded', 'false');
      }
    });
    profileDropdownMenu.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }

  // Xử lý đăng xuất
  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      profileDropdownMenu.classList.add('hidden');
      profileDropdownButton.setAttribute('aria-expanded', 'false');
      if (confirm('Bạn có chắc muốn đăng xuất?')) {
        localStorage.removeItem('currentUser');
        alert('Đăng xuất thành công!');
        window.location.href = '../index.html';
      }
    });
  }

  // Xử lý modal ứng tuyển
  if (applyButtons && applyModal) {
    applyButtons.forEach(button => {
      button.addEventListener('click', () => {
        toggleModal(applyModal, true);
      });
    });
  }
  if (applyModalClose) {
    applyModalClose.addEventListener('click', () => {
      toggleModal(applyModal, false);
      if (applyForm) applyForm.reset();
      if (errorCoverLetter) errorCoverLetter.classList.add('hidden');
    });
  }
  if (applyModal) {
    applyModal.addEventListener('click', (e) => {
      if (e.target === applyModal) {
        toggleModal(applyModal, false);
        if (applyForm) applyForm.reset();
        if (errorCoverLetter) errorCoverLetter.classList.add('hidden');
      }
    });
  }

  // Xử lý form ứng tuyển
  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!coverLetter.value.trim()) {
        errorCoverLetter.classList.remove('hidden');
        coverLetter.focus();
        return;
      }
      errorCoverLetter.classList.add('hidden');
      alert('Ứng tuyển thành công! Nhà tuyển dụng sẽ liên hệ với bạn sớm.');
      toggleModal(applyModal, false);
      applyForm.reset();
    });
  }

  // Xử lý form đăng dự án
  if (projectForm) {
    projectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('project-title').value.trim();
      const description = document.getElementById('project-description').value.trim();
      const skills = document.getElementById('project-skills').value.trim();
      const budgetMin = parseFloat(document.getElementById('budget-min').value);
      const budgetMax = parseFloat(document.getElementById('budget-max').value);

      const errorTitle = document.getElementById('error-title');
      const errorDescription = document.getElementById('error-description');
      const errorSkills = document.getElementById('error-skills');
      const errorBudgetMin = document.getElementById('error-budget-min');
      const errorBudgetMax = document.getElementById('error-budget-max');

      let hasError = false;

      if (!title) {
        errorTitle.classList.remove('hidden');
        hasError = true;
      } else {
        errorTitle.classList.add('hidden');
      }
      if (!description) {
        errorDescription.classList.remove('hidden');
        hasError = true;
      } else {
        errorDescription.classList.add('hidden');
      }
      if (!skills) {
        errorSkills.classList.remove('hidden');
        hasError = true;
      } else {
        errorSkills.classList.add('hidden');
      }
      if (isNaN(budgetMin) || budgetMin < 0) {
        errorBudgetMin.classList.remove('hidden');
        hasError = true;
      } else {
        errorBudgetMin.classList.add('hidden');
      }
      if (isNaN(budgetMax) || budgetMax < budgetMin) {
        errorBudgetMax.classList.remove('hidden');
        hasError = true;
      } else {
        errorBudgetMax.classList.add('hidden');
      }

      if (hasError) return;

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        const newProject = {
          id: projects.length + 1,
          title,
          budget: `$${budgetMin} - $${budgetMax}`,
          applicants: 0,
          status: 'Chờ duyệt',
          client: currentUser.email,
          description,
          skills
        };
        projects.push(newProject);
        localStorage.setItem('projects', JSON.stringify(projects));
        alert('Dự án đã được đăng thành công!');
        projectForm.reset();
      }
    });
  }

  // Xử lý modal xem ứng viên
  if (viewApplicantsButtons && applicantsModal) {
    viewApplicantsButtons.forEach(button => {
      button.addEventListener('click', () => {
        toggleModal(applicantsModal, true);
      });
    });
  }
  if (applicantsModalClose) {
    applicantsModalClose.addEventListener('click', () => {
      toggleModal(applicantsModal, false);
    });
  }
  if (applicantsModal) {
    applicantsModal.addEventListener('click', (e) => {
      if (e.target === applicantsModal) {
        toggleModal(applicantsModal, false);
      }
    });
  }

  // Xử lý xóa dự án
  if (deleteProjectButtons) {
    deleteProjectButtons.forEach(button => {
      button.addEventListener('click', () => {
        const projectId = button.dataset.projectId;
        if (confirm('Bạn có chắc muốn xóa dự án này?')) {
          let projects = JSON.parse(localStorage.getItem('projects')) || [];
          projects = projects.filter(project => project.id !== parseInt(projectId));
          localStorage.setItem('projects', JSON.stringify(projects));
          alert('Dự án đã được xóa thành công!');
          window.location.reload();
        }
      });
    });
  }

  // Xử lý chấp nhận ứng viên
  if (acceptApplicantButtons) {
    acceptApplicantButtons.forEach(button => {
      button.addEventListener('click', () => {
        const applicantId = button.dataset.applicantId;
        alert(`Ứng viên ${applicantId} đã được chấp nhận!`);
        toggleModal(applicantsModal, false);
      });
    });
  }

  // Xử lý chọn sao đánh giá
  if (ratingStars && ratingInput) {
    ratingStars.forEach(star => {
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        ratingInput.value = value;
        ratingStars.forEach(s => {
          const sValue = parseInt(s.dataset.value);
          s.classList.toggle('text-yellow-400', sValue <= value);
          s.classList.toggle('text-gray-300', sValue > value);
        });
      });
    });
  }

  // Xử lý form đánh giá
  if (ratingForm) {
    ratingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const freelancerName = document.getElementById('freelancer-name').value;
      const rating = ratingInput.value;
      const review = document.getElementById('review').value.trim();

      let hasError = false;

      if (!freelancerName) {
        errorFreelancer.classList.remove('hidden');
        hasError = true;
      } else {
        errorFreelancer.classList.add('hidden');
      }
      if (!rating) {
        errorRating.classList.remove('hidden');
        hasError = true;
      } else {
        errorRating.classList.add('hidden');
      }
      if (!review) {
        errorReview.classList.remove('hidden');
        hasError = true;
      } else {
        errorReview.classList.add('hidden');
      }

      if (hasError) return;

      const currentUser = JSON.parse(localStorage.getItem('currentUser'));
      if (currentUser) {
        const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
        reviews.push({
          freelancer: freelancerName,
          rating: parseInt(rating),
          review,
          client: currentUser.fullName,
          date: new Date().toLocaleDateString('vi-VN')
        });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        alert('Đánh giá đã được gửi thành công!');
        ratingForm.reset();
        ratingStars.forEach(star => star.classList.add('text-gray-300'));
        ratingInput.value = '';
      }
    });
  }

  // Thêm trình xử lý sự kiện cho nút đăng nhập
  if (loginButton && loginModal) {
    loginButton.addEventListener('click', () => toggleModal(loginModal, true));
  }

  // Thêm trình xử lý sự kiện cho nút đăng ký
  if (registerButton && registerModal) {
    registerButton.addEventListener('click', () => toggleModal(registerModal, true));
  }

  // Thêm trình xử lý sự kiện cho nút đóng modal đăng nhập
  if (loginModalClose && loginModal) {
    loginModalClose.addEventListener('click', () => toggleModal(loginModal, false));
  }

  // Thêm trình xử lý sự kiện cho nút đóng modal đăng ký
  if (registerModalClose && registerModal) {
    registerModalClose.addEventListener('click', () => toggleModal(registerModal, false));
  }

  // Đóng modal khi nhấp ra ngoài
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        toggleModal(loginModal, false);
      }
    });
  }
  if (registerModal) {
    registerModal.addEventListener('click', (e) => {
      if (e.target === registerModal) {
        toggleModal(registerModal, false);
      }
    });
  }

  // Đóng modal khi nhấn phím Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleModal(loginModal, false);
      toggleModal(registerModal, false);
      toggleModal(applyModal, false);
      toggleModal(applicantsModal, false);
      if (applyForm) applyForm.reset();
      if (errorCoverLetter) errorCoverLetter.classList.add('hidden');
      if (profileDropdownMenu && !profileDropdownMenu.classList.contains('hidden')) {
        profileDropdownMenu.classList.add('hidden');
        profileDropdownButton.setAttribute('aria-expanded', 'false');
      }
    }
  });

  // Tải thông tin hồ sơ khi trang được tải
  loadProfile();
});
