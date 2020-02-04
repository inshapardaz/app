import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';

export default class Footer  extends Component
{
	render ()
	{
		return (
			<footer className="footer__area bg__cat--8 brown--color">
				<div className="copyright__wrapper">
					<div className="container">
						<div className="row">
							<div className="col-lg-6 col-md-6 col-sm-12">
								<div className="copyright">
									<div className="copy__right__inner text-right">
										<p> <FormattedMessage id="footer.copyrights" /></p>
									</div>
								</div>
							</div>
							<div className="col-lg-6 col-md-6 col-sm-12">
								<div className="payment text-right">
									<img src="images/icons/payment.png" alt="" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</footer>);
	}
}
