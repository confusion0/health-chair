import SiteHeader from '../components/SiteHeader.tsx';

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <section>
        <h2>About HealthChair</h2>
        <p>Health care demand has been skyrocketing over recent years. Members of our teams have experience in volunteering in hospitals or providing first aid. We have witnessed the overwhelming demand for doctors and health care providers. Our experience has led us to develop a health care assistant software to provide health care reducing the overflow of patients in health care facilities.</p>
        <h3>What it does</h3>
        <p>Our project, HealthChair, inputs data from individuals ranging from age and gender to medical conditions and symptoms. With this data it provides checklists and tasks for users to complete throughout their day such as consuming more water. In addition, it provides medical perspectives of user’s conditions and will significantly reduce visits to medical facilities through keeping people healthy and helping them understand their symptoms.</p>
        <h3>How we built it</h3>
        <p>We developed the application using a Python backend and a JavaScript frontend, combining the power of Flask and React to build the application. The app integrates OpenAI's GPT-4 model to provide advanced AI capabilities. The software also implements a MySQL database for storing user data securely and efficiently. Finally, we create a login system with cookies for convenience so users don't need to log in every time.</p>
      </section>
    </>
  )
}