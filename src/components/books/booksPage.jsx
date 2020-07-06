import React, { Component } from 'react';
import queryString from 'query-string';
import { injectIntl } from 'react-intl';
import Typography from '@material-ui/core/Typography';

import LibraryService from '../../services/LibraryService';

class BooksPage extends Component
{
	constructor (props)
	{
		super(props);
		this.state = {
		  categoryId : 0,
		  authorId : 0,
		  seriesId : 0,
		  author : null,
		  category : null,
		  series : null,
		  query : ''
		};
	  }

	async componentDidMount ()
	{
		const values = queryString.parse(this.props.location.search);

		this.setState({ query : values.q ? values.q : '' });

		if (values.category && values.category > 0)
		{
		  await this.loadData(0, values.category, 0);
		}
		else if (values.author && values.author > 0)
		{
		  await this.loadData(values.author, 0, 0);
		}
		else if (values.series && values.series > 0)
		{
		  await this.loadData(0, 0, values.series);
		}
		else
		{
		  await this.loadData();
		}
	}

	async componentWillReceiveProps (nextProps)
	{
		const values = queryString.parse(nextProps.location.search);
		this.setState({ query : values.q ? values.q : '' });

		if (values.category && this.state.categoryId != values.category)
		{
		  await this.loadData(0, values.category);
		}
		else if (values.author && this.state.authorId != values.author)
		{
		  await this.loadData(0, 0, values.author);
		}
		else if (values.series && this.state.seriesId != values.series)
		{
		  await this.loadData(0, 0, values.series);
		}
		else
		{
		  await this.loadData();
		}
	}

	async loadData (authorId = 0, categoryId = 0, seriesId = 0)
	{
		try
		{
			this.setState({ authorId });
			this.setState({ categoryId });
			this.setState({ seriesId });

			if (authorId > 0)
			{
				let author = await LibraryService.getAuthor(authorId);
				this.setState({ author });
			}

			if (categoryId > 0)
			{
				let category = await LibraryService.getCategory(categoryId);
				this.setState({ category });
			}

			if (seriesId > 0)
			{
				let series = await LibraryService.getSeriesById(seriesId);
				this.setState({ series });
			}
		}
		catch (e)
		{
			console.error(e);
		}
	}

	onSubmit = (value) =>
	{
		let values = queryString.parse(this.props.location.search);
		values.q = value;
		this.props.history.push(`${this.props.location.pathname}?${queryString.stringify(values)}`);
	}

	render ()
	{
		const { author, category, series } = this.state;

		let headerContent = this.props.intl.formatMessage({ id : 'header.books' });
		if (author)
		{
			headerContent = author.name;
		}
		else if (category)
		{
			headerContent = category.name;
		}
		else if (series)
		{
			headerContent = series.name;
		}

		return (
			<>
				<Typography component="h3">{headerContent}</Typography>
			</>
		);
	}
}

export default injectIntl(BooksPage);
