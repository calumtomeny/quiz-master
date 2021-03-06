﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using QuizMaster.Persistence;

namespace QuizMaster.Persistence.Migrations
{
    [DbContext(typeof(QuizContext))]
    [Migration("20200515110126_SeedData")]
    partial class SeedData
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "3.1.4");

            modelBuilder.Entity("QuizMaster.Domain.Quiz", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Quiz");

                    b.HasData(
                        new
                        {
                            Id = new Guid("588686c0-4c6a-4f23-ad84-5f041b53c1f3"),
                            Name = "AOE Quiz"
                        },
                        new
                        {
                            Id = new Guid("442dfff5-7df9-44f0-a190-383d9c04f78e"),
                            Name = "Sports Quiz"
                        });
                });
#pragma warning restore 612, 618
        }
    }
}
