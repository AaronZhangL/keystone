var React = require('react');
var xhr = require('xhr');
var { plural } = require('../utils');

const ICON_TAGS_BOOK = ['books', 'posts', 'blog', 'blog-posts', 'stories', 'news-stories', 'content'];
const ICON_TAGS_BRIEFCASE = ['businesses', 'companies', 'listings', 'organizations', 'partners'];
const ICON_TAGS_CALENDAR = ['events', 'dates'];
const ICON_TAGS_CLOCK = ['classes', 'hours', 'times'];
const ICON_TAGS_FILE_MEDIA = ['gallery', 'galleries', 'images', 'photos', 'pictures'];
const ICON_TAGS_FILE_TEXT = ['attachments', 'docs', 'documents', 'files'];
const ICON_TAGS_LOCATION = ['locations', 'markers', 'places'];
const ICON_TAGS_MAIL = ['emails', 'enquiries'];
const ICON_TAGS_MEGAPHONE = ['broadcasts', 'jobs', 'talks'];
const ICON_TAGS_ORGANIZATION = ['contacts', 'customers', 'groups', 'members', 'people', 'speakers', 'teams', 'users'];
const ICON_TAGS_PACKAGE = ['boxes', 'items', 'packages', 'parcels'];
const ICON_TAGS_TAG = ['tags'];

var listsByKey = {};
Keystone.lists.forEach((list) => {
	listsByKey[list.key] = list;
});

var ListTile = React.createClass({
	propTypes: {
		count: React.PropTypes.number,
		href: React.PropTypes.string,
		label: React.PropTypes.string,
	},
	render () {
		return (
			<li className="dashboard-group__list">
				<span className="dashboard-group__list-inner">
					<a href={this.props.href} className="dashboard-group__list-tile">
						<div className="dashboard-group__list-label">{this.props.label}</div>
						<div className="dashboard-group__list-count">{this.props.count}</div>
					</a>
					<a href={this.props.href} className="dashboard-group__list-create octicon octicon-plus" title="Create" />
				</span>
			</li>
		);
	},
});

var View = React.createClass({

	displayName: 'HomeView',

	getInitialState () {
		return {
			counts: {}
		};
	},

	componentDidMount () {
		this.loadCounts();
	},

	loadCounts () {
		xhr({
			url: '/keystone/api/counts'
		}, (err, resp, body) => {
			try {
				body = JSON.parse(body);
			} catch(e) {
				console.log('Error parsing results json:', e, body);
				return;
			}
			if (body && body.counts) {
				if (!this.isMounted()) return;
				this.setState({
					counts: body.counts
				});
			}
		});
	},

	renderFlatNav () {
		return Keystone.lists.map((list) => {
			var href = list.external ? list.path : '/keystone/' + list.path;
			return (
				<h3 key={list.path}>
					<a href={href}>{list.label}</a>
				</h3>
			);
		});
	},

	renderGroupedNav () {
		return (
			<div>
				{Keystone.nav.sections.map((navSection) => {
					var headingIconClass = 'dashboard-group__heading-icon octicon octicon-';

					if (ICON_TAGS_BRIEFCASE.indexOf(navSection.key) !== -1) { headingIconClass += 'briefcase'; }
					else if (ICON_TAGS_BOOK.indexOf(navSection.key) !== -1) { headingIconClass += 'book'; }
					else if (ICON_TAGS_CALENDAR.indexOf(navSection.key) !== -1) { headingIconClass += 'calendar'; }
					else if (ICON_TAGS_CLOCK.indexOf(navSection.key) !== -1) { headingIconClass += 'clock'; }
					else if (ICON_TAGS_FILE_MEDIA.indexOf(navSection.key) !== -1) { headingIconClass += 'file-media'; }
					else if (ICON_TAGS_FILE_TEXT.indexOf(navSection.key) !== -1) { headingIconClass += 'file-text'; }
					else if (ICON_TAGS_LOCATION.indexOf(navSection.key) !== -1) { headingIconClass += 'location'; }
					else if (ICON_TAGS_MAIL.indexOf(navSection.key) !== -1) { headingIconClass += 'mail'; }
					else if (ICON_TAGS_MEGAPHONE.indexOf(navSection.key) !== -1) { headingIconClass += 'megaphone'; }
					else if (ICON_TAGS_ORGANIZATION.indexOf(navSection.key) !== -1) { headingIconClass += 'organization'; }
					else if (ICON_TAGS_PACKAGE.indexOf(navSection.key) !== -1) { headingIconClass += 'package'; }
					else if (ICON_TAGS_TAG.indexOf(navSection.key) !== -1) { headingIconClass += 'tag'; }
					else { headingIconClass += 'primitive-dot'; }

					return (
						<div className="dashboard-group" key={navSection.key}>
							<div className="dashboard-group__heading">
								<span className={headingIconClass} />
								{navSection.label}
							</div>
							<ul className="dashboard-group__lists">
								{navSection.lists.map((list) => {
									var href = list.external ? list.path : '/keystone/' + list.path;
									return <ListTile key={list.path} label={list.label} href={href} count={plural(this.state.counts[list.key], '* Item', '* Items')} />;
								})}
							</ul>
						</div>
					);
				})}
				{() => {
					if (!Keystone.orphanedLists.length) return;
					return (
						<div className="dashboard-group">
							<div className="dashboard-group__heading">
								<span className="dashboard-group__heading-icon octicon octicon-database" />
								Other
							</div>
							<ul className="dashboard-group__lists">
								{Keystone.orphanedLists.map((list) => {
									return <ListTile key={list.path} label={list.label} href={href} count={plural(this.state.counts[list.key], '* Item', '* Items')} />;
								})}
							</ul>
						</div>
					);
				}()}
			</div>
		);
	},

	render () {
		return (
			<div className="container">
				<div className="page-header"><h1>{Keystone.brand}</h1></div>
				<div className="dashboard-groups">
					{Keystone.nav.flat ? this.renderFlatNav() : this.renderGroupedNav()}
				</div>
			</div>
		);
	}

});

React.render(<View />, document.getElementById('home-view'));
