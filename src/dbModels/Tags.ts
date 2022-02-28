import { Model, Table, Column, DataType } from "sequelize-typescript";

@Table
export default class Tags extends Model {
  @Column(DataType.STRING)
  guildID: string;

  @Column(DataType.STRING)
  userID: string;

  @Column(DataType.STRING)
  name: string;

  @Column(DataType.TEXT)
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  global: boolean;
}