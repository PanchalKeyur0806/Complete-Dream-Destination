import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';

function ExploreMenu({ category, setCategory }) {
  return (
    <div className='explore-menu container mt-5'  id='explore-menu'>
      <h1>Explore Our Menu</h1>
      <p className='explore-menu-text'>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt animi pariatur eos nihil id in nostrum excepturi labore quod dolorem! Odio eaque nihil voluptates quibusdam totam consequatur animi facere similique.
      </p>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => (
          <div onClick={() => setCategory(prev => (prev === item.menu_name ? "All" : item.menu_name))} key={index}
            className='explore-menu-list-item'>
            <img className={category === item.menu_name ? "active" : ""} src={item.menu_image} alt="" />
            <p>{item.menu_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreMenu;
