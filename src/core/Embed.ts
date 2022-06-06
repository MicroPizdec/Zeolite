export default class Embed {
  public title?: string;
  public description?: string;
  public url?: string;
  public timestamp?: string;
  public color?: number;
  public footer?: EmbedFooter;
  public image?: EmbedImage;
  public thumbnail?: EmbedImage;
  public author?: EmbedAuthor;
  public fields?: EmbedField[];

  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  public setDescription(description: string): this {
    this.description = description;
    return this;
  }

  public setURL(url: string): this {
    this.url = url;
    return this;
  }

  public setTimestamp(timestamp: string): this {
    this.timestamp = timestamp;
    return this;
  }

  public setColor(color: number): this {
    this.color = color;
    return this;
  }

  public setFooter(data: EmbedFooter): this {
    this.footer = data;
    return this;
  }

  public setImage(url: string): this {
    this.image = { url };
    return this;
  }

  public setThumbnail(url: string): this {
    this.thumbnail = { url };
    return this;
  }

  public setAuthor(data: EmbedAuthor): this {
    this.author = data;
    return this;
  }

  public addField(name: string, value: string, inline?: boolean): this {
    if (!this.fields) this.fields = [];

    this.fields.push({ name, value, inline });

    return this;
  }
}

interface EmbedFooter {
  text: string;
  icon_url?: string;
}

interface EmbedImage {
  url: string;
}

interface EmbedAuthor {
  name: string;
  url?: string;
  icon_url?: string;
}

interface EmbedField {
  name: string;
  value: string;
  inline?: boolean;
}