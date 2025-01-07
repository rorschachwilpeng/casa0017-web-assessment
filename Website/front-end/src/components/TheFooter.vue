<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- 页脚导航链接 -->
      <div class="footer-nav">
        <div class="nav-column">
          <h4>Home</h4>
          <ul>
            <li><a href="#">Categories</a></li>
            <li><a href="#">Devices</a></li>
            <li><a href="#">Pricing</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>
        <div class="nav-column">
          <h4>Movies</h4>
          <ul>
            <li><a href="#">Genres</a></li>
            <li><a href="#">Trending</a></li>
            <li><a href="#">New Release</a></li>
            <li><a href="#">Popular</a></li>
          </ul>
        </div>
        <div class="nav-column">
          <h4>Cinemas</h4>
          <ul>
            <li><a href="#">Locations</a></li>
            <li><a href="#">Partners</a></li>
            <li><a href="#">Vue Theater</a></li>
            <li><a href="#">Popular</a></li>
          </ul>
        </div>
        <div class="nav-column">
          <h4>Support</h4>
          <ul>
            <li><a href="#">Contact Us</a></li>
          </ul>
        </div>
        <div class="nav-column">
          <h4>Subscription</h4>
          <ul>
            <li><a href="#">Plans</a></li>
            <li><a href="#">Features</a></li>
          </ul>
        </div>
        <div class="nav-column">
          <h4>Connect With Us</h4>
          <div class="social-links">
            <a href="#"><i class="fab fa-facebook"></i></a>
            <a href="#"><i class="fab fa-twitter"></i></a>
            <a href="#"><i class="fab fa-linkedin"></i></a>
          </div>
        </div>
      </div>

      <!-- 页脚底部 -->
      <div class="footer-bottom">
        <p class="copyright">© 2024 StreamVibe. All Rights Reserved.</p>
        <div class="footer-links">
          <a href="#">Terms of Use</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'TheFooter'
}
</script>

<style scoped>
.footer {
  background: #0F0F0F;
  padding: 60px 0 24px;
  margin-top: 0;
  width: 100%;
  min-width: 320px;
}

.footer-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 5%;
}

/* 页脚导航 */
.footer-nav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 40px;
  margin-bottom: 60px;
  padding-bottom: 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-column h4 {
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 24px;
}

.nav-column ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-column ul li {
  margin-bottom: 16px;
}

.nav-column ul li a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.nav-column ul li a:hover {
  color: #FFFFFF;
}

/* 社交媒体链接 */
.social-links {
  display: flex;
  gap: 16px;
}

.social-links a {
  color: rgba(255, 255, 255, 0.6);
  font-size: 20px;
  transition: color 0.3s ease;
}

.social-links a:hover {
  color: #FFFFFF;
}

/* 页脚底部 */
.footer-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 24px;
}

.copyright {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.footer-links {
  display: flex;
  gap: 24px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.3s ease;
}

.footer-links a:hover {
  color: #FFFFFF;
}

/* 响应式调整 */
@media screen and (max-width: 1200px) {
  .footer-content {
    padding: 0 40px;
  }
}

@media screen and (max-width: 768px) {
  .footer-nav {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 30px;
  }
  
  .footer-bottom {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
  
  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media screen and (max-width: 480px) {
  .footer-content {
    padding: 0 20px;
  }
  
  .footer-nav {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
}
</style> 