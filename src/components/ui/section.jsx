import React from 'react';
import PropTypes from 'prop-types';

export default function Section (props)
{
	let subTitle = null;
	if  (props.subTitle)
	{
		subTitle = <p>{props.subTitle}</p>;
	}

	return (
		<section className="pt--80  pb--30">
			<div className="container">
				<div className="row">
					<div className="col-lg-12">
						<div className="section__title text-center">
							<h2 className="title__be--2">{props.title}</h2>
							{subTitle}
						</div>
						<div className="container">
							{props.children}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

Section.propTypes = {
	title : PropTypes.object.isRequired
};
