import React, { Component } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import "./App.css";

export class News extends Component {
  static defaultProps = {
    country: "in",
    pageSize: 5,
    category: "general",
  };

  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

  constructor() {
    super();
    this.state = {
      articles: [],
      loading: false,
      page: 1,
    };
  }

  // Update news based on page number
  updateNews = async (page) => {
    this.setState({ loading: true });
    const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=bee9726160d644669912f97b2106ea7c&page=${page}&pageSize=${this.props.pageSize}`;
    try {
      const data = await fetch(url);
      const parsedData = await data.json();
      console.log(parsedData);
      this.setState({
        articles: parsedData.articles,
        totalResults: parsedData.totalResults,
        loading: false,
        page,
      });
    } catch (error) {
      console.error("Error fetching news data:", error);
      this.setState({ loading: false });
    }
  };

  // Initial fetch when component mounts
  async componentDidMount() {
    this.updateNews(this.state.page);
  }

  handlePrevClick = async () => {
    this.updateNews(this.state.page - 1);
  };

  handleNextClick = async () => {
    this.updateNews(this.state.page + 1);
  };

  render() {
    return (
      <div className="container my-3" id="contai">
        <h1 className="text-center" style={{ margin: "35px 0px" }}>
          CurrentChronicals - Top Headlines
        </h1>
        {this.state.loading && <Spinner />}
        <div className="row">
          {!this.state.loading &&
            this.state.articles.map((element) => {
              return (
                <div className="col-md-4" key={element.url}>
                  <NewsItem
                    title={element.title ? element.title : ""}
                    description={element.description ? element.description : ""}
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>
              );
            })}
        </div>
        <div className="container d-flex justify-content-between">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button
            disabled={
              this.state.page + 1 >
              Math.ceil(this.state.totalResults / this.props.pageSize)
            }
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;
