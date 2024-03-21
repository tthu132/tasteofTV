import Slider from "react-slick";
import Images from "../Images";
import styles from './Slider.module.scss'

function SliderComponent({ arrImages }) {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoSpeed: 600
    };
    console.log(arrImages);
    return (
        <Slider {...settings}>
            {arrImages.map((item, index) => {
                return (
                    <Images src={item} key={index}></Images>
                )
            })}
        </Slider>
    );
}

export default SliderComponent;