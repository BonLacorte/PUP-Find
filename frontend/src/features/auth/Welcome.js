import { Link } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

const Welcome = () => {

    const { email, firstname, lastname, isEmployee, isAdmin } = useAuth()

    const date = new Date()
    const today = new Intl.DateTimeFormat('en-US', { dateStyle: 'full', timeStyle: 'long' }).format(date)

    const content = (
        // <section className="welcome">

            // {/* <p>{today}</p>

            // <h1>Welcome!</h1> */}

            // {/* <p><Link to="/dash/menu">View Menu</Link></p>

            // <p><Link to="/dash/about">View About</Link></p>

            // <p><Link to="/dash/gallery">View Gallery</Link></p>

            // <p><Link to="/dash/contact">View Contact</Link></p> */}

        // {/* </section> */}

        <div >
            <div >
                {/* <img src="path-to-your-image.jpg" alt="Banner Image" class="max-w-full"> */}
            </div>
            <div className="py-20 mx-auto w-3/5">
            {/* <div class="flex-1 flex flex-col justify-center items-start py-20 mx-auto w-3/5"> */}
                <p>Welcome {email}!</p>
                <h1 className="text-[clamp(2rem,5vw,4rem)] text-[#4c4c4c] max-w-[600px]">Your Favourite Food Delivered Hot & Fresh</h1>
                <p className="text-[clamp(1rem,3vw,1.5rem)] max-w-[500px] text-[#6a6a6a] mx-0 my-6">Healthy switcher chefs do all the prep work, like peeding, chopping
                & marinating, so you can cook a fresh food.</p>
                <button className="bg-red-700 text-[1.1rem] cursor-pointer font-semibold text-[white] transition-[0.2s] flex items-center justify-center px-10 py-4 rounded-[5rem] border-[none] hover:bg-red-900">
                <Link to="/menu">Order Now</Link>
                </button>
            </div>
            <section className="py-20 mx-auto w-3/5">
            {/* <section className="bg-light-100"> */}
                <div className="flex items-center flex-col ">
                <h1 className="text-dark-grey font-bold text-lg  py-3 md:text-6xl">
                    Our Collections
                </h1>
                <p className="text-light-grey text-sm mb-4">
                    What would you like to sip today?
                </p>
                </div>
                {/* <CoffeeCard /> */}
            </section>
            <section className="py-20 mx-auto w-3/5">
            {/* <section className="flex justify-between bg-light-100 flex-col-reverse md:flex-row"> */}
                <div className="p-4 w-full">
                <h1 className="text-dark-grey font-bold text-lg  py-3 md:text-6xl capitalize">
                    Order Your favourite Coffee
                </h1>
                <p className="text-light-grey text-sm py-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque iusto
                    sunt voluptatem, ducimus laudantium ut voluptatibus in ullam dolores
                    eveniet laboriosam neque consectetur, numquam maiores, deserunt quod
                    suscipit? Accusamus, cupiditate?
                </p>
                <button className="bg-orange text-white p-3 rounded-lg px-4 uppercase my-2 w-full md:w-auto ">
                    View More
                </button>
                </div>
                <div className="p-6 w-full">
                <img
                    className="w-full h-auto md:h-[80%] object-cover rounded-md overflow-hidden"
                    src="https://images.unsplash.com/photo-1604881988758-f76ad2f7aac1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80"
                    alt="A cup of coffee"
                />
                </div>
            </section>
        </div>

        
    )

    return content
}
export default Welcome